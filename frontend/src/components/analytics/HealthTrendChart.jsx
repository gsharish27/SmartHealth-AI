import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Heart, Activity, Wind, Droplet, Scale, Moon } from 'lucide-react';

const metricConfigs = {
  heartRate: {
    title: 'Heart Rate',
    unit: 'BPM',
    color: '#ef4444',
    icon: Heart,
    keys: [{ dataKey: 'heartRate', name: 'Heart Rate (BPM)', color: '#ef4444' }],
  },
  bloodPressure: {
    title: 'Blood Pressure',
    unit: 'mmHg',
    color: '#3b82f6',
    icon: Activity,
    keys: [
      { dataKey: 'systolicBp', name: 'Systolic (mmHg)', color: '#2563eb' },
      { dataKey: 'diastolicBp', name: 'Diastolic (mmHg)', color: '#60a5fa' },
    ],
  },
  bloodGlucose: {
    title: 'Blood Glucose',
    unit: 'mg/dL',
    color: '#f59e0b',
    icon: Droplet,
    keys: [{ dataKey: 'bloodGlucose', name: 'Glucose (mg/dL)', color: '#f59e0b' }],
  },
  spo2: {
    title: 'Oxygen Saturation (SpO2)',
    unit: '%',
    color: '#06b6d4',
    icon: Wind,
    keys: [{ dataKey: 'spo2', name: 'SpO2 (%)', color: '#06b6d4' }],
  },
  weight: {
    title: 'Body Weight',
    unit: 'kg',
    color: '#8b5cf6',
    icon: Scale,
    keys: [{ dataKey: 'weightKg', name: 'Weight (kg)', color: '#8b5cf6' }],
  },
  sleep: {
    title: 'Sleep Duration',
    unit: 'hrs',
    color: '#6366f1',
    icon: Moon,
    keys: [{ dataKey: 'sleepHours', name: 'Sleep (hrs)', color: '#6366f1' }],
  },
};

export default function HealthTrendChart({ data = [] }) {
  const [activeMetric, setActiveMetric] = useState('heartRate');
  const currentConfig = metricConfigs[activeMetric];

  return (
    <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-soft-sm space-y-6">
      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.entries(metricConfigs).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = activeMetric === key;
          return (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-sky-600 text-white shadow-soft-sm'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{config.title}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Title */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">{currentConfig.title} Trend Analytics</h3>
          <p className="text-xs text-muted-foreground">Historical measurements over selected timeframe</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20">
          Unit: {currentConfig.unit}
        </span>
      </div>

      {/* Recharts Render Container */}
      <div className="h-80 w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {currentConfig.keys.map((k) => (
                  <linearGradient key={k.dataKey} id={`gradient-${k.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={k.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={k.color} stopOpacity={0.0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              {currentConfig.keys.map((k) => (
                <Area
                  key={k.dataKey}
                  type="monotone"
                  dataKey={k.dataKey}
                  name={k.name}
                  stroke={k.color}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#gradient-${k.dataKey})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No historical chart data available for the selected timeframe.
          </div>
        )}
      </div>
    </div>
  );
}
