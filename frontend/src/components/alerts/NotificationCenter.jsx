import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatDateTime, getStatusBadgeStyle } from '../../utils/formatters';

export default function NotificationCenter({ alerts = [], onMarkRead }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-card border border-border/60">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
        <h4 className="text-sm font-bold">All Systems Normal</h4>
        <p className="text-xs text-muted-foreground mt-0.5">No unread or active health monitoring alerts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isCritical = alert.alertLevel === 'CRITICAL';
        const isWarning = alert.alertLevel === 'WARNING';

        return (
          <div
            key={alert.id}
            className={`relative flex flex-col sm:flex-row items-start justify-between gap-4 p-5 rounded-3xl border transition-all ${
              isCritical
                ? 'bg-rose-500/5 border-rose-500/30 dark:bg-rose-950/20'
                : isWarning
                ? 'bg-amber-500/5 border-amber-500/30 dark:bg-amber-950/20'
                : 'bg-card border-border/80'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                  isCritical
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    : isWarning
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                }`}
              >
                {isCritical ? <ShieldAlert className="w-5 h-5" /> : isWarning ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(alert.alertLevel)}`}>
                    {alert.alertLevel}
                  </span>
                  <span className="text-xs font-bold text-foreground">{alert.metricType.replace('_', ' ')}: {alert.triggeredValue}</span>
                  <span className="text-[11px] text-muted-foreground">• {formatDateTime(alert.createdAt)}</span>
                </div>

                <p className="text-xs font-medium text-foreground leading-relaxed">
                  {alert.message}
                </p>

                {alert.guidance && (
                  <div className="mt-2 p-3 rounded-2xl bg-background/80 border border-border/60 text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Recommended Guidance:</strong> {alert.guidance}
                  </div>
                )}
              </div>
            </div>

            {!alert.isRead && onMarkRead && (
              <button
                onClick={() => onMarkRead(alert.id)}
                className="self-end sm:self-start px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
