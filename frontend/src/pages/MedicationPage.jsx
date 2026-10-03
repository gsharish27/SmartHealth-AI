import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import { Pill, Plus, CheckCircle2, Clock, Trash2, Calendar, AlertCircle } from 'lucide-react';

export default function MedicationPage() {
  const { addToast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    instructions: '',
    startDate: new Date().toISOString().slice(0, 10),
  });

  const { data: medications, isLoading, refetch } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const res = await axiosClient.get('/medications');
      return res.data;
    },
  });

  const handleTakeDose = async (id) => {
    try {
      await axiosClient.post(`/medications/${id}/take`);
      addToast('Medication marked as taken!', 'success');
      refetch();
    } catch (err) {
      addToast('Failed to log dose', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this prescription?')) return;
    try {
      await axiosClient.delete(`/medications/${id}`);
      addToast('Medication deleted', 'info');
      refetch();
    } catch (err) {
      addToast('Failed to delete medication', 'error');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/medications', newMed);
      addToast('New medication added to schedule', 'success');
      setIsAddOpen(false);
      setNewMed({ name: '', dosage: '', frequency: 'Once daily', instructions: '', startDate: new Date().toISOString().slice(0, 10) });
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add medication', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-500" /> Medication Schedule & Prescriptions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track daily prescription compliance, dosage schedules, and take log history.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all hover:opacity-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Medication
        </button>
      </div>

      {isLoading ? (
        <SkeletonLoader type="card" count={4} />
      ) : !medications?.length ? (
        <EmptyState
          title="No Active Medications"
          description="You currently have no active medication prescriptions listed."
          action={
            <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-teal-500 text-white text-xs font-bold rounded-xl">
              Add First Prescription
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map((med) => (
            <div
              key={med.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all duration-200 relative group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-2xl">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{med.name}</h3>
                      <span className="text-xs font-semibold text-slate-400">{med.dosage} • {med.frequency}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 rounded-xl transition-opacity"
                    title="Delete Prescription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-400">Instructions:</span>
                    <span>{med.instructions || 'Take as directed'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-400">Start Date:</span>
                    <span>{med.startDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span>Next Dose: Today</span>
                </div>

                {med.nextDoseTaken ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4" /> Taken
                  </span>
                ) : (
                  <button
                    onClick={() => handleTakeDose(med.id)}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Taken
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Medication Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Medication">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Medicine Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Lisinopril, Metformin"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Dosage</label>
              <input
                type="text"
                required
                placeholder="e.g. 10mg, 1 Tablet"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Frequency</label>
              <select
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="As needed">As needed (PRN)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Special Instructions</label>
            <textarea
              rows="2"
              placeholder="Take with food, take before bed, etc."
              value={newMed.instructions}
              onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 font-semibold text-slate-500">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-xl">
              Save Medication
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
