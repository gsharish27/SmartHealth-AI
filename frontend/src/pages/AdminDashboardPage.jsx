import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import MainLayout from '../layouts/MainLayout';
import Pagination from '../components/common/Pagination';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { 
  ShieldCheck, 
  Users, 
  Stethoscope, 
  FileText, 
  Calendar, 
  Bell, 
  Search, 
  CheckCircle2, 
  XCircle,
  Activity
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const { data: metricsRes, isLoading: metricsLoading } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: () => adminApi.getSystemMetrics(),
  });

  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers', page, debouncedSearch],
    queryFn: () => adminApi.getUsers({ page, size: 10, search: debouncedSearch || undefined }),
  });

  const metrics = metricsRes?.data;
  const pagedUsers = usersRes?.data;

  const toggleStatusMutation = useMutation({
    mutationFn: (id) => adminApi.toggleUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminMetrics']);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => adminApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
    },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">System Administration Portal</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Platform metric overview, role-based authorization management, and security controls
            </p>
          </div>
        </div>

        {/* System Metric Cards Grid */}
        {metricsLoading ? (
          <SkeletonLoader count={6} type="card" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-soft-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Total Registered Users</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics?.totalUsers || 0}</p>
                <p className="text-[11px] text-emerald-600 font-semibold">{metrics?.activeUsers || 0} Accounts Active</p>
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-soft-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Network Physicians</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics?.totalDoctors || 0}</p>
                <p className="text-[11px] text-muted-foreground">Licensed Medical Practitioners</p>
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-soft-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Total Health Records</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics?.totalHealthRecords || 0}</p>
                <p className="text-[11px] text-muted-foreground">Indexed Vital Logs</p>
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-soft-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Total Appointments</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics?.totalAppointments || 0}</p>
                <p className="text-[11px] text-muted-foreground">Scheduled & Completed Visits</p>
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-soft-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Safety Alerts Triggered</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics?.totalAlerts || 0}</p>
                <p className="text-[11px] text-rose-500 font-semibold">{metrics?.criticalAlerts || 0} Critical Thresholds</p>
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-soft-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">System Uptime</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics?.systemUptimePercentage || 99.9}%</p>
                <p className="text-[11px] text-emerald-600 font-semibold">PostgreSQL & Flyway Online</p>
              </div>
            </div>
          </div>
        )}

        {/* User Management Table */}
        <div className="rounded-3xl bg-card border border-border/80 shadow-soft-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground">User Directory & Role Control</h3>
              <p className="text-xs text-muted-foreground">Manage user activation states and authority assignments</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {usersLoading ? (
            <SkeletonLoader count={5} type="table" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-6">User</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Roles</th>
                    <th className="py-3.5 px-4">Role Action</th>
                    <th className="py-3.5 px-6 text-right">Account Lock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {pagedUsers?.content?.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-foreground flex items-center gap-3">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div>{u.fullName}</div>
                          <div className="text-[10px] text-muted-foreground font-normal">{u.email}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            <XCircle className="w-3 h-3" /> Deactivated
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sky-600">
                        {u.roles?.join(', ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              updateRoleMutation.mutate({ id: u.id, role: e.target.value });
                            }
                          }}
                          defaultValue=""
                          className="px-2 py-1 rounded-lg border border-border bg-background text-[11px] font-medium"
                        >
                          <option value="" disabled>Grant Role...</option>
                          <option value="ROLE_USER">Grant Patient (ROLE_USER)</option>
                          <option value="ROLE_DOCTOR">Grant Doctor (ROLE_DOCTOR)</option>
                          <option value="ROLE_ADMIN">Grant Admin (ROLE_ADMIN)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => toggleStatusMutation.mutate(u.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            u.isActive
                              ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-border/60">
            <Pagination
              page={pagedUsers?.page || 0}
              totalPages={pagedUsers?.totalPages || 1}
              totalElements={pagedUsers?.totalElements || 0}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
