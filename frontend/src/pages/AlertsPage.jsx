import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '../api/alertsApi';
import MainLayout from '../layouts/MainLayout';
import NotificationCenter from '../components/alerts/NotificationCenter';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { BellRing, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const [levelFilter, setLevelFilter] = useState('');

  const { data: alertsRes, isLoading } = useQuery({
    queryKey: ['userAlerts', levelFilter],
    queryFn: () => alertsApi.getAlerts({ level: levelFilter || undefined, size: 30 }),
  });

  const alerts = alertsRes?.data?.content || [];

  const markReadMutation = useMutation({
    mutationFn: (id) => alertsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['userAlerts']);
      queryClient.invalidateQueries(['dashboardOverview']);
    },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-rose-500" />
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">Notification & Alert Center</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated metric threshold safety alerts & medical guidance
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-card border border-border/80 p-1.5 rounded-2xl text-xs">
            <button
              onClick={() => setLevelFilter('')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                levelFilter === '' ? 'bg-sky-600 text-white shadow-soft-sm' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setLevelFilter('CRITICAL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                levelFilter === 'CRITICAL' ? 'bg-rose-600 text-white shadow-soft-sm' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setLevelFilter('WARNING')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                levelFilter === 'WARNING' ? 'bg-amber-600 text-white shadow-soft-sm' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              Warning
            </button>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Automated Safety Monitoring Notice:</strong>
            <p className="text-blue-700 dark:text-blue-400 mt-0.5 leading-relaxed">
              Alerts generated here represent non-diagnostic threshold notifications based on configured target baselines. If you experience severe symptoms or medical emergencies, please call your local emergency medical services immediately.
            </p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader count={3} type="table" />
        ) : (
          <NotificationCenter
            alerts={alerts}
            onMarkRead={(id) => markReadMutation.mutate(id)}
          />
        )}
      </div>
    </MainLayout>
  );
}
