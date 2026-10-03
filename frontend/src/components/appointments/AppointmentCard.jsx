import React from 'react';
import { Calendar, Clock, MapPin, User, Stethoscope, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate, formatTime, getStatusBadgeStyle } from '../../utils/formatters';

export default function AppointmentCard({ appointment, onCancel, onUpdateStatus }) {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-card border border-border/80 p-5 shadow-soft-sm hover:shadow-soft-md transition-all">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">{appointment.doctorName}</h4>
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-500" /> {appointment.hospitalName}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>

        {/* Date & Time Highlight Pill */}
        <div className="flex items-center gap-4 text-xs font-semibold bg-muted/40 p-3 rounded-2xl border border-border/40 my-3">
          <div className="flex items-center gap-1.5 text-foreground">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>{formatDate(appointment.appointmentDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground border-l border-border/80 pl-4">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>{formatTime(appointment.appointmentDate)}</span>
          </div>
        </div>

        {/* Reason for Appointment */}
        <div className="text-xs space-y-1">
          <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Reason for Visit</span>
          <p className="text-foreground leading-relaxed font-medium">{appointment.reason}</p>
        </div>

        {appointment.doctorNotes && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <span className="font-bold text-amber-700 dark:text-amber-300">Doctor Notes:</span>
            <p className="text-amber-800 dark:text-amber-200 mt-0.5">{appointment.doctorNotes}</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {appointment.status === 'UPCOMING' && onCancel && (
        <div className="pt-3 mt-3 border-t border-border/50 flex justify-end">
          <button
            onClick={() => onCancel(appointment.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel Appointment
          </button>
        </div>
      )}
    </div>
  );
}
