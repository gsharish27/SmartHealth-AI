import React from 'react';
import { formatDateTime } from '../../utils/formatters';
import { Eye, Edit2, Trash2, Download } from 'lucide-react';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';

export default function HealthRecordTable({
  records = [],
  page = 0,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onExportCSV
}) {
  if (!records || records.length === 0) {
    return <EmptyState title="No Health Records Logged" description="Click 'Log Vitals' above to create your first entry." />;
  }

  return (
    <div className="rounded-3xl bg-card border border-border/80 shadow-soft-sm overflow-hidden">
      {/* Table Action Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
        <div>
          <h3 className="text-sm font-bold text-foreground">Logged Vital Sign Entries</h3>
          <p className="text-xs text-muted-foreground">Server-paginated audit trail of all health records</p>
        </div>
        {onExportCSV && (
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-border/80 hover:bg-muted transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Date & Time</th>
              <th className="py-3.5 px-4">Heart Rate</th>
              <th className="py-3.5 px-4">Blood Pressure</th>
              <th className="py-3.5 px-4">SpO2</th>
              <th className="py-3.5 px-4">Glucose</th>
              <th className="py-3.5 px-4">Temp</th>
              <th className="py-3.5 px-4">Weight</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-medium">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-foreground whitespace-nowrap">
                  {formatDateTime(r.recordedAt)}
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-rose-600 dark:text-rose-400">{r.heartRate ? `${r.heartRate} BPM` : '--'}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{r.bloodPressureFormatted || '--'}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{r.spo2 ? `${r.spo2}%` : '--'}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-amber-600 dark:text-amber-400">{r.bloodGlucose ? `${r.bloodGlucose} mg/dL` : '--'}</span>
                </td>
                <td className="py-3.5 px-4">{r.bodyTemperature ? `${r.bodyTemperature} °C` : '--'}</td>
                <td className="py-3.5 px-4">{r.weightKg ? `${r.weightKg} kg` : '--'}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onViewRecord && (
                      <button
                        onClick={() => onViewRecord(r)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-sky-600 hover:bg-sky-500/10 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEditRecord && (
                      <button
                        onClick={() => onEditRecord(r)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
                        title="Edit Entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteRecord && (
                      <button
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border/60">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
