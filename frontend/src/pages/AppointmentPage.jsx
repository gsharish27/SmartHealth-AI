import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import { Calendar, Plus, Clock, Stethoscope, Building2, CheckCircle2, XCircle } from 'lucide-react';

export default function AppointmentPage() {
  const { addToast } = useToast();
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({
    reason: '',
    appointmentDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    notes: '',
  });

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await axiosClient.get('/appointments');
      return res.data;
    },
  });

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this scheduled appointment?')) return;
    try {
      await axiosClient.post(`/appointments/${id}/cancel`);
      addToast('Appointment cancelled', 'info');
      refetch();
    } catch (err) {
      addToast('Failed to cancel appointment', 'error');
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/appointments', {
        ...newAppt,
        appointmentDate: new Date(newAppt.appointmentDate).toISOString(),
      });
      addToast('Appointment booked successfully!', 'success');
      setIsBookOpen(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Booking failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-500" /> Clinical Consultations & Appointments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Book consultations with cardiology and primary care specialists.
          </p>
        </div>

        <button
          onClick={() => setIsBookOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all hover:opacity-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {isLoading ? (
        <SkeletonLoader type="card" count={3} />
      ) : !appointments?.length ? (
        <EmptyState
          title="No Appointments Scheduled"
          description="You currently have no upcoming or past clinical consultations."
          action={
            <button onClick={() => setIsBookOpen(true)} className="px-4 py-2 bg-teal-500 text-white text-xs font-bold rounded-xl">
              Book First Consultation
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{appt.doctorName}</h3>
                      <p className="text-xs text-slate-400">{appt.doctorSpecialty}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    appt.status === 'SCHEDULED'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : appt.status === 'COMPLETED'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}>
                    {appt.status}
                  </span>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                    <Building2 className="w-4 h-4 text-teal-500" />
                    <span>{appt.hospitalClinic}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                    <Clock className="w-4 h-4 text-teal-500" />
                    <span>{new Date(appt.appointmentDate).toLocaleString()}</span>
                  </div>
                  <div className="pt-1 text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Reason:</span> {appt.reason}
                  </div>
                </div>
              </div>

              {appt.status === 'SCHEDULED' && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} title="Book Clinical Consultation">
        <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Attending Specialist</label>
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Dr. Sarah Jenkins</span>
                <span className="text-[11px] text-teal-600 dark:text-teal-400">Cardiology & General Medicine • St. Jude Hospital</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Reason for Visit</label>
            <input
              type="text"
              required
              placeholder="e.g. Routine Cardiovascular Checkup, Telemetry Review"
              value={newAppt.reason}
              onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={newAppt.appointmentDate}
              onChange={(e) => setNewAppt({ ...newAppt, appointmentDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setIsBookOpen(false)} className="px-4 py-2 font-semibold text-slate-500">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-xl">
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
