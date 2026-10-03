import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import axiosClient from '../api/axiosClient';

export default function HealthRecordFormModal({ isOpen, onClose, record, onSuccess }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    heartRate: '',
    systolicBp: '',
    diastolicBp: '',
    spo2: '',
    bloodGlucose: '',
    temperature: '',
    weight: '',
    height: '',
    notes: '',
    recordedAt: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        heartRate: record.heartRate || '',
        systolicBp: record.systolicBp || '',
        diastolicBp: record.diastolicBp || '',
        spo2: record.spo2 || '',
        bloodGlucose: record.bloodGlucose || '',
        temperature: record.temperature || '',
        weight: record.weight || '',
        height: record.height || '',
        notes: record.notes || '',
        recordedAt: record.recordedAt ? record.recordedAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        heartRate: '',
        systolicBp: '',
        diastolicBp: '',
        spo2: '',
        bloodGlucose: '',
        temperature: '',
        weight: '',
        height: '',
        notes: '',
        recordedAt: new Date().toISOString().slice(0, 16),
      });
    }
  }, [record, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
      systolicBp: formData.systolicBp ? parseInt(formData.systolicBp) : null,
      diastolicBp: formData.diastolicBp ? parseInt(formData.diastolicBp) : null,
      spo2: formData.spo2 ? parseFloat(formData.spo2) : null,
      bloodGlucose: formData.bloodGlucose ? parseFloat(formData.bloodGlucose) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      notes: formData.notes,
      recordedAt: formData.recordedAt ? new Date(formData.recordedAt).toISOString() : new Date().toISOString(),
    };

    try {
      if (record) {
        await axiosClient.put(`/health-records/${record.id}`, payload);
        addToast('Health telemetry updated successfully', 'success');
      } else {
        await axiosClient.post('/health-records', payload);
        addToast('New health telemetry recorded successfully!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save health record', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={record ? 'Edit Health Telemetry' : 'Log New Vital Signs'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vital Signs</div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Heart Rate (BPM)</label>
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              placeholder="72"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">SpO2 (%)</label>
            <input
              type="number"
              step="0.1"
              name="spo2"
              value={formData.spo2}
              onChange={handleChange}
              placeholder="98.5"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Systolic BP (mmHg)</label>
            <input
              type="number"
              name="systolicBp"
              value={formData.systolicBp}
              onChange={handleChange}
              placeholder="120"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Diastolic BP (mmHg)</label>
            <input
              type="number"
              name="diastolicBp"
              value={formData.diastolicBp}
              onChange={handleChange}
              placeholder="80"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Blood Glucose (mg/dL)</label>
            <input
              type="number"
              step="0.1"
              name="bloodGlucose"
              value={formData.bloodGlucose}
              onChange={handleChange}
              placeholder="95.0"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="36.6"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">Body Measurements</div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="75.5"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Height (cm)</label>
            <input
              type="number"
              step="0.1"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="178.0"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Date & Time Recorded</label>
          <input
            type="datetime-local"
            name="recordedAt"
            value={formData.recordedAt}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Notes / Context</label>
          <textarea
            rows="2"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Morning baseline, post exercise, feeling tired, etc."
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-xl shadow-md shadow-teal-500/20 disabled:opacity-50"
          >
            {loading ? 'Saving...' : record ? 'Update Record' : 'Save Telemetry'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
