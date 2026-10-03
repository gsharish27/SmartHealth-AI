import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ 
  title = "No data found", 
  description = "There are no records matching your current filter criteria.", 
  actionLabel, 
  onAction,
  icon: Icon = FolderOpen
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-card border border-border/60 shadow-soft-sm my-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-soft-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
