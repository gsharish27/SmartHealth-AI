import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { TIME_RANGES } from '../../utils/constants';

export default function DateRangePicker({ selectedRange, onSelectRange, customStart, customEnd, onCustomChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card border border-border/80 p-3 shadow-soft-sm">
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <CalendarIcon className="w-4 h-4 text-sky-600 ml-2 mr-1 hidden sm:inline-block" />
        {TIME_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => onSelectRange(range.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRange === range.value
                ? 'bg-sky-600 text-white shadow-soft-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {selectedRange === 'custom' && (
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
          <input
            type="date"
            value={customStart || ''}
            onChange={(e) => onCustomChange(e.target.value, customEnd)}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
          />
          <span className="text-muted-foreground font-bold">to</span>
          <input
            type="date"
            value={customEnd || ''}
            onChange={(e) => onCustomChange(customStart, e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
          />
        </div>
      )}
    </div>
  );
}
