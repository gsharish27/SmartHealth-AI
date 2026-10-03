import React from 'react';
import { ShieldCheck, Activity, TrendingUp, Sparkles } from 'lucide-react';

export default function HealthScoreCard({ score = 82 }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#121C2D] border border-[#E5EAF0] dark:border-[#1E2C42] p-6 shadow-card-sm flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="space-y-2 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A6A0]/10 text-[#16A6A0] text-secondary-text font-bold">
          <Sparkles className="w-3.5 h-3.5" /> AI Health Assessment Index
        </div>
        <h3 className="h2-section">Overall Health Score</h3>
        <p className="text-secondary-text max-w-md">
          Calculated from real-time heart rate variability, blood pressure trends, oxygenation levels, and activity patterns over the last 30 days.
        </p>
      </div>

      {/* Circle / Badge Display */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-4 border-[#16A6A0]/20 bg-[#F6F8FB] dark:bg-[#1E2C42]">
          <div className="text-center">
            <span className="text-3xl font-black text-[#123B66] dark:text-white leading-none">{score}</span>
            <span className="block text-[11px] font-bold text-[#687386]">/ 100</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20A464]" />
            <span className="font-semibold text-[#172033] dark:text-white">Status: Optimal Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#16A6A0]" />
            <span className="text-[#687386]">+4 points from last week</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#123B66]" />
            <span className="text-[#687386]">AI Telemetry Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
