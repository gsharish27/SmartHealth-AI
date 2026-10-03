import React from 'react';

export default function SkeletonLoader({ count = 4, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-card border border-border p-4 animate-pulse space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-muted rounded-md" />
              <div className="h-8 w-8 bg-muted rounded-lg" />
            </div>
            <div className="h-8 w-32 bg-muted rounded-md" />
            <div className="h-3 w-40 bg-muted rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full rounded-2xl bg-card border border-border p-4 animate-pulse space-y-4">
        <div className="h-10 w-full bg-muted rounded-xl" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-muted/60 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl bg-card border border-border animate-pulse" />
  );
}
