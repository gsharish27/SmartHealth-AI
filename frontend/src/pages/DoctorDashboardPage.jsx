import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../api/doctorsApi';
import MainLayout from '../layouts/MainLayout';
import Modal from '../components/common/Modal';
import HealthTrendChart from '../components/analytics/HealthTrendChart';
import HealthRecordTable from '../components/records/HealthRecordTable';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { Stethoscope, Search, Eye, User, Heart, ShieldCheck, Activity } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export default function DoctorDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [overviewModalOpen, setOverviewModalOpen] = useState(false);

  const { data: patientsRes, isLoading } = useQuery({
    queryKey: ['doctorPatients', debouncedSearch],
    queryFn: () => doctorsApi.getDoctorPatients({ search: debouncedSearch || undefined }),
  });

  const { data: overviewRes, isLoading: overviewLoading } = useQuery({
    queryKey: ['patientOverview', selectedPatientId],
    queryFn: () => doctorsApi.getPatientOverview(selectedPatientId),
    enabled: !!selectedPatientId && overviewModalOpen,
  });

  const patients = patientsRes?.data?.content || [];
  const patientOverview = overviewRes?.data;

  const handleOpenOverview = (patientId) => {
    setSelectedPatientId(patientId);
    setOverviewModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">Physician Clinical Portal</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Secure patient access panel for authorized clinical telemetry & trend inspection
            </p>
          </div>

          {/* Search Patient */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search granted patients..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Patient Roster */}
        {isLoading ? (
          <SkeletonLoader count={4} type="table" />
        ) : (
          <div className="rounded-3xl bg-card border border-border/80 shadow-soft-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/60">
              <h3 className="text-sm font-bold text-foreground">Assigned Clinical Patients</h3>
              <p className="text-xs text-muted-foreground">Showing active HIPAA/GDPR access consent permissions</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-6">Patient Name</th>
                    <th className="py-3.5 px-4">Age / Gender</th>
                    <th className="py-3.5 px-4">Blood Group</th>
                    <th className="py-3.5 px-4">Latest Vitals</th>
                    <th className="py-3.5 px-4">Active Alerts</th>
                    <th className="py-3.5 px-6 text-right">Clinical Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {patients.map((p) => (
                    <tr key={p.patientId} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-foreground flex items-center gap-3">
                        <img
                          src={p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                          alt={p.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div>{p.fullName}</div>
                          <div className="text-[10px] text-muted-foreground font-normal">{p.email}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{p.age ? `${p.age} yrs` : 'N/A'} • {p.gender || 'N/A'}</td>
                      <td className="py-3.5 px-4 font-bold text-sky-600">{p.bloodGroup || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        {p.latestVitals ? (
                          <span>
                            HR: <strong className="text-rose-500">{p.latestVitals.heartRate || '--'}</strong> | BP: <strong className="text-blue-500">{p.latestVitals.bloodPressureFormatted || '--'}</strong>
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">No vitals logged</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.activeAlerts && p.activeAlerts.length > 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            {p.activeAlerts.length} Active Alert(s)
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">Normal</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => handleOpenOverview(p.patientId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-soft-sm transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Clinical View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Patient Comprehensive Clinical Overview Modal */}
        <Modal
          isOpen={overviewModalOpen}
          onClose={() => setOverviewModalOpen(false)}
          title="Patient Comprehensive Telemetry Overview"
          maxWidth="max-w-4xl"
        >
          {overviewLoading ? (
            <SkeletonLoader count={4} type="card" />
          ) : patientOverview ? (
            <div className="space-y-6 text-xs">
              {/* Patient Header */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <img
                  src={patientOverview.user?.avatarUrl}
                  alt={patientOverview.user?.fullName}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-base font-extrabold text-foreground">{patientOverview.user?.fullName}</h3>
                  <p className="text-muted-foreground">{patientOverview.user?.email} • {patientOverview.user?.phoneNumber}</p>
                  <p className="text-sky-600 font-bold mt-0.5">
                    Blood Group: {patientOverview.profile?.bloodGroup || 'O+'} | Allergies: {patientOverview.profile?.allergies || 'None'}
                  </p>
                </div>
              </div>

              {/* Patient Trend Chart */}
              <div>
                <h4 className="font-bold text-sm text-foreground mb-2">30-Day Vitals Telemetry Trend</h4>
                <HealthTrendChart data={patientOverview.trendHistory || []} />
              </div>

              {/* Patient Recent Records */}
              <div>
                <h4 className="font-bold text-sm text-foreground mb-2">Recent Logged Entries</h4>
                <HealthRecordTable records={patientOverview.latestVitals ? [patientOverview.latestVitals] : []} />
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </MainLayout>
  );
}
