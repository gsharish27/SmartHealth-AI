import React from 'react';
import { Pill, Calendar, Clock, CheckCircle2, Edit2, Trash2, User } from 'lucide-react';
import { formatDate, formatDateTime, getStatusBadgeStyle } from '../../utils/formatters';

export default function MedicationCard({ medication, onMarkTaken, onEdit, onDelete }) {
  const pendingSchedule = medication.schedules?.find((s) => s.status === 'PENDING');

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-card border border-border/80 p-5 shadow-soft-sm hover:shadow-soft-md transition-all duration-300">
      <div>
        {/* Card Top Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground leading-tight">{medication.name}</h4>
              <p className="text-xs font-semibold text-muted-foreground">{medication.dosage} • {medication.frequency}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(medication.status)}`}>
            {medication.status}
          </span>
        </div>

        {/* Prescription & Date Details */}
        <div className="space-y-1.5 text-xs text-muted-foreground my-3 bg-muted/30 p-3 rounded-2xl border border-border/40">
          {medication.prescribedBy && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-500" />
              <span>Prescribed by: <strong className="text-foreground">{medication.prescribedBy}</strong></span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>
              Duration: {formatDate(medication.startDate)} {medication.endDate ? `— ${formatDate(medication.endDate)}` : '(Ongoing)'}
            </span>
          </div>
          {pendingSchedule && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Next Scheduled Dose: {formatDateTime(pendingSchedule.scheduledTime)}</span>
            </div>
          )}
        </div>

        {medication.notes && (
          <p className="text-xs text-muted-foreground italic mb-3">
            "{medication.notes}"
          </p>
        )}
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
        {pendingSchedule ? (
          <button
            onClick={() => onMarkTaken(pendingSchedule.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-soft-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Dose Taken
          </button>
        ) : (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Doses Up To Date
          </span>
        )}

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(medication)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
              title="Edit Medication"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(medication.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
              title="Delete Medication"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
