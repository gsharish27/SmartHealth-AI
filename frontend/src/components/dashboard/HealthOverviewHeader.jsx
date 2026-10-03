import React from 'react';
import { Calendar, ShieldCheck, Activity } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function HealthOverviewHeader({ greeting, subhead }) {
  const today = formatDate(new Date());

  return (
    <div className="rounded-3xl bg-white dark:bg-[#121C2D] border border-[#E5EAF0] dark:border-[#1E2C42] p-6 sm:p-8 shadow-card-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123B66]/10 text-[#123B66] dark:text-[#16A6A0] text-secondary-text font-bold">
            <Activity className="w-3.5 h-3.5 text-[#16A6A0]" />
            <span>AI Real-time Health Telemetry</span>
          </div>
          <h1 className="h1-page mt-2">{greeting || "Good morning"}</h1>
          <p className="body-regular text-[#687386]">{subhead || "Here's your health overview for today."}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F6F8FB] dark:bg-[#1E2C42] border border-[#E5EAF0] dark:border-[#1E2C42] text-secondary-text font-semibold">
            <Calendar className="w-4 h-4 text-[#16A6A0]" />
            <span>{today}</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#20A464]/10 border border-[#20A464]/20 text-secondary-text font-bold text-[#20A464]">
            <ShieldCheck className="w-4 h-4" />
            <span>Vitals Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
