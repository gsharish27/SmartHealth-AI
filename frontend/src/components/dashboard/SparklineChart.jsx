import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export default function SparklineChart({ data = [], color = '#0284c7' }) {
  if (!data || data.length === 0) {
    return <div className="h-10 w-full" />;
  }

  const chartData = data.map((val, idx) => ({ idx, val }));

  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
