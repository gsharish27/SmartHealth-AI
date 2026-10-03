import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthRecordsApi } from '../api/healthRecordsApi';
import MainLayout from '../layouts/MainLayout';
import HealthOverviewHeader from '../components/dashboard/HealthOverviewHeader';
import HealthScoreCard from '../components/dashboard/HealthScoreCard';
import VitalCard from '../components/dashboard/VitalCard';
import HealthTrendChart from '../components/analytics/HealthTrendChart';
import SkeletonLoader from '../components/common/SkeletonLoader';
import NotificationCenter from '../components/alerts/NotificationCenter';
import AppointmentCard from '../components/appointments/AppointmentCard';
import MedicationCard from '../components/medications/MedicationCard';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Pill, ArrowRight, BrainCircuit, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  const { data: overviewRes, isLoading, isError } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: () => healthRecordsApi.getOverview(),
    staleTime: 60000,
  });

  const { data: trendsRes } = useQuery({
    queryKey: ['healthTrends', '7d'],
    queryFn: () => healthRecordsApi.getTrends({ timeRange: '7d' }),
    staleTime: 60000,
  });

  const overview = overviewRes?.data;
  const trends = trendsRes?.data || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Greeting Banner */}
        <HealthOverviewHeader
          greeting={overview?.greeting}
          subhead={overview?.subhead}
        />

        {/* Health Score Component (82 / 100) */}
        <HealthScoreCard score={82} />

        {/* Health Metrics Grid Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="h2-section">Health Metrics & Telemetry</h2>
              <p className="text-secondary-text">Live clinical vital sign measurements</p>
            </div>
            <Link to="/analytics" className="text-secondary-text font-bold text-[#16A6A0] hover:underline flex items-center gap-1">
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <SkeletonLoader count={8} type="card" />
          ) : isError ? (
            <div className="p-4 rounded-2xl bg-[#D94A4A]/10 text-[#D94A4A] text-xs font-semibold">
              Unable to reach backend telemetry stream. Displaying cached baseline metrics.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {overview?.vitalCards?.map((card) => (
                <VitalCard key={card.key} card={card} />
              ))}
            </div>
          )}
        </div>

        {/* Health Trends Interactive Chart Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="h2-section">Health Trends</h2>
            <span className="text-secondary-text">7-Day Telemetry Stream</span>
          </div>
          <HealthTrendChart data={trends} />
        </div>

        {/* AI Analysis Summary & Quick Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Analysis Insights Widget */}
          <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-[#121C2D] border border-[#E5EAF0] dark:border-[#1E2C42] p-6 shadow-card-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0] dark:border-[#1E2C42]">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#16A6A0]" />
                <h3 className="h3-card">AI Clinical Insights</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#16A6A0]/10 text-[#16A6A0]">Automated</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-[#F6F8FB] dark:bg-[#1E2C42] border border-[#E5EAF0] dark:border-[#1E2C42]">
                <strong className="text-[#123B66] dark:text-white font-bold block mb-1">Cardiovascular Stability:</strong>
                <p className="text-[#687386]">Resting heart rate remains steady within 70-76 BPM range. Blood pressure is well-controlled.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F8FB] dark:bg-[#1E2C42] border border-[#E5EAF0] dark:border-[#1E2C42]">
                <strong className="text-[#123B66] dark:text-white font-bold block mb-1">Sleep & Recovery Index:</strong>
                <p className="text-[#687386]">Averaging 7.8 hours per night. Sleep quality score is +8% higher than last month.</p>
              </div>
            </div>
          </div>

          {/* Active Alerts Widget */}
          <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-[#121C2D] border border-[#E5EAF0] dark:border-[#1E2C42] p-6 shadow-card-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0] dark:border-[#1E2C42]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D94A4A]" />
                <h3 className="h3-card">Monitoring Alerts</h3>
              </div>
              <Link to="/alerts" className="text-secondary-text font-bold text-[#16A6A0] hover:underline">View All</Link>
            </div>
            <NotificationCenter alerts={overview?.recentAlerts?.slice(0, 2)} />
          </div>

          {/* Appointments & Medication Reminders */}
          <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-[#121C2D] border border-[#E5EAF0] dark:border-[#1E2C42] p-6 shadow-card-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0] dark:border-[#1E2C42]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#123B66] dark:text-white" />
                <h3 className="h3-card">Scheduled Visits</h3>
              </div>
              <Link to="/appointments" className="text-secondary-text font-bold text-[#16A6A0] hover:underline">Manage</Link>
            </div>

            {overview?.upcomingAppointments && overview.upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {overview.upcomingAppointments.slice(0, 1).map((app) => (
                  <AppointmentCard key={app.id} appointment={app} />
                ))}
              </div>
            ) : (
              <p className="text-secondary-text text-center py-4">No upcoming appointments scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
