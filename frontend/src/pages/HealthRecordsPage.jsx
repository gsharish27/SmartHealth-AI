import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import HealthRecordFormModal from './HealthRecordFormModal';
import Modal from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  Heart, 
  Activity, 
  Wind, 
  Droplets, 
  Calendar 
} from 'lucide-react';

export default function HealthRecordsPage() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('recordedAt');
  const [sortDir, setSortDir] = useState('DESC');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['healthRecords', page, search, sortBy, sortDir],
    queryFn: async () => {
      const params = {
        page,
        size: 10,
        sortBy,
        sortDir,
        search: search || undefined,
      };
      const res = await axiosClient.get('/health-records', { params });
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this health record entry?')) return;
    try {
      await axiosClient.delete(`/health-records/${id}`);
      addToast('Health record entry deleted successfully', 'info');
      refetch();
    } catch (err) {
      addToast('Failed to delete health record', 'error');
    }
  };

  const handleExportCSV = () => {
    if (!data?.content?.length) return;
    const headers = ['ID', 'Recorded At', 'Heart Rate', 'Systolic BP', 'Diastolic BP', 'SpO2', 'Glucose', 'Temp', 'Weight', 'Notes'];
    const rows = data.content.map(r => [
      r.id,
      r.recordedAt,
      r.heartRate || '',
      r.systolicBp || '',
      r.diastolicBp || '',
      r.spo2 || '',
      r.bloodGlucose || '',
      r.temperature || '',
      r.weight || '',
      `"${r.notes || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `health_telemetry_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Telemetry dataset exported to CSV file', 'success');
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortDir('DESC');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-500" /> Health Telemetry Records
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Server-side paginated digital record database with instant sorting, search, and export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-2xl flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => { setSelectedRecord(null); setIsFormOpen(true); }}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search telemetry notes, vital parameters..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Records Table */}
      {isLoading ? (
        <SkeletonLoader type="table" count={8} />
      ) : !data?.content?.length ? (
        <EmptyState
          title="No Health Records Found"
          description="Try adjusting your search query or log a new telemetry reading."
          action={
            <button
              onClick={() => { setSelectedRecord(null); setIsFormOpen(true); }}
              className="px-4 py-2 bg-teal-500 text-white text-xs font-bold rounded-xl"
            >
              Log First Entry
            </button>
          }
        />
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 cursor-pointer" onClick={() => toggleSort('recordedAt')}>
                    <div className="flex items-center gap-1">Date & Time <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-3.5 px-4">Heart Rate</th>
                  <th className="py-3.5 px-4">Blood Pressure</th>
                  <th className="py-3.5 px-4">SpO2</th>
                  <th className="py-3.5 px-4">Blood Glucose</th>
                  <th className="py-3.5 px-4">Weight</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {data.content.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {new Date(rec.recordedAt).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.heartRate ? (
                        <span className="font-bold text-slate-800 dark:text-slate-200">{rec.heartRate} <span className="text-[10px] text-slate-400 font-normal">BPM</span></span>
                      ) : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.systolicBp ? (
                        <span className="font-bold text-slate-800 dark:text-slate-200">{rec.systolicBp}/{rec.diastolicBp} <span className="text-[10px] text-slate-400 font-normal">mmHg</span></span>
                      ) : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.spo2 ? (
                        <span className="font-bold text-slate-800 dark:text-slate-200">{rec.spo2}%</span>
                      ) : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.bloodGlucose ? (
                        <span className="font-bold text-slate-800 dark:text-slate-200">{rec.bloodGlucose} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span></span>
                      ) : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.weight ? (
                        <span className="font-bold text-slate-800 dark:text-slate-200">{rec.weight} <span className="text-[10px] text-slate-400 font-normal">kg</span></span>
                      ) : '-'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 dark:text-slate-400">
                      {rec.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewRecord(rec)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedRecord(rec); setIsFormOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Entry"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Form Modal */}
      <HealthRecordFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        record={selectedRecord}
        onSuccess={refetch}
      />

      {/* View Detail Modal */}
      <Modal isOpen={!!viewRecord} onClose={() => setViewRecord(null)} title="Health Telemetry Record Details">
        {viewRecord && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl text-teal-800 dark:text-teal-200 font-bold flex items-center justify-between">
              <span>Recorded Timestamp</span>
              <span>{new Date(viewRecord.recordedAt).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block font-semibold">Heart Rate</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{viewRecord.heartRate || 'N/A'} BPM</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block font-semibold">Blood Pressure</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{viewRecord.systolicBp ? `${viewRecord.systolicBp}/${viewRecord.diastolicBp}` : 'N/A'} mmHg</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block font-semibold">SpO2 Oxygen</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{viewRecord.spo2 || 'N/A'} %</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block font-semibold">Blood Glucose</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{viewRecord.bloodGlucose || 'N/A'} mg/dL</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">Clinical Notes</span>
              <p className="text-slate-700 dark:text-slate-300">{viewRecord.notes || 'No notes provided for this reading entry.'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
