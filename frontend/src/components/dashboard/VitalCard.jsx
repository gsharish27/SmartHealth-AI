import React from 'react';
import SparklineChart from './SparklineChart';
import { 
  Heart, 
  Activity, 
  Wind, 
  Droplet, 
  Scale, 
  Thermometer, 
  Moon, 
  Footprints,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

const iconMap = {
  Heart: Heart,
  Activity: Activity,
  Wind: Wind,
  Droplet: Droplet,
  Scale: Scale,
  Thermometer: Thermometer,
  Moon: Moon,
  Footprints: Footprints,
};

export default function VitalCard({ card }) {
  const IconComponent = iconMap[card.icon] || Activity;

  // Medical status color helper
  const getBadgeStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'NORMAL':
      case 'OPTIMAL':
      case 'GOAL MET':
        return 'bg-[#20A464]/10 text-[#20A464] border-[#20A464]/20';
      case 'WARNING':
      case 'ELEVATED':
      case 'IN PROGRESS':
        return 'bg-[#E5A11A]/10 text-[#E5A11A] border-[#E5A11A]/20';
      case 'CRITICAL':
      case 'FEVER':
        return 'bg-[#D94A4A]/10 text-[#D94A4A] border-[#D94A4A]/20';
      default:
        return 'bg-[#687386]/10 text-[#687386] border-[#687386]/20';
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-[#121C2D] border border-[#E5EAF0] dark:border-[#1E2C42] p-4 shadow-card-sm hover:shadow-card-md transition-all duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#123B66]/10 text-[#123B66] dark:text-[#16A6A0]">
            <IconComponent className="w-4 h-4" />
          </div>
          <h4 className="h3-card">{card.title}</h4>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getBadgeStyle(card.status)}`}>
          {card.status}
        </span>
      </div>

      {/* Main Measurement */}
      <div className="grid grid-cols-2 items-end gap-2 my-2">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#172033] dark:text-white tracking-tight">
              {card.currentValue}
            </span>
            <span className="text-secondary-text font-bold">{card.unit}</span>
          </div>
        </div>

        {/* Mini sparkline */}
        <div className="h-8 w-full overflow-hidden">
          <SparklineChart data={card.sparklineData} color="#16A6A0" />
        </div>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF0] dark:border-[#1E2C42] text-secondary-text">
        <div className="flex items-center gap-1 font-medium">
          {card.changeDirection === 'UP' && <ArrowUpRight className="w-3.5 h-3.5 text-[#D94A4A]" />}
          {card.changeDirection === 'DOWN' && <ArrowDownRight className="w-3.5 h-3.5 text-[#20A464]" />}
          {card.changeDirection === 'FLAT' && <Minus className="w-3.5 h-3.5 text-[#687386]" />}
          <span>{card.changePercentage}</span>
        </div>
        <span>{card.lastUpdatedText}</span>
      </div>
    </div>
  );
}
