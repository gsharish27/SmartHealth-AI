import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthRecordsApi } from '../api/healthRecordsApi';
import MainLayout from '../layouts/MainLayout';
import HealthTrendChart from '../components/analytics/HealthTrendChart';
import DateRangePicker from '../components/analytics/DateRangePicker';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { TrendingUp, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const { data: trendsRes, isLoading } = useQuery({
    queryKey: ['healthTrends', timeRange, customStart, customEnd],
    queryFn: () =>
      healthRecordsApi.getTrends({
        timeRange,
        customStart: customStart ? new Date(customStart).toISOString() : undefined,
        customEnd: customEnd ? new Date(customEnd).toISOString() : undefined,
      }),
    staleTime: 30000,
  });

  const trends = trendsRes?.data || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">Health Analytics & Trends</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Interactive telemetry graphs for heart rate, blood pressure, glucose, SpO2, weight, and sleep
            </p>
          </div>

          <DateRangePicker
            selectedRange={timeRange}
            onSelectRange={setTimeRange}
            customStart={customStart}
            customEnd={customEnd}
            onCustomChange={(s, e) => {
              setCustomStart(s);
              setCustomEnd(e);
            }}
          />
        </div>

        {/* Recharts Analytics Component */}
        {isLoading ? (
          <SkeletonLoader count={1} type="chart" />
        ) : (
          <HealthTrendChart data={trends} />
        )}
      </div>
    </MainLayout>
  );
}
