import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Pill, Save } from 'lucide-react';

export default function MedicationFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once Daily (Morning)',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    prescribedBy: '',
    status: 'ACTIVE',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        dosage: initialData.dosage || '',
        frequency: initialData.frequency || 'Once Daily (Morning)',
        startDate: initialData.startDate || new Date().toISOString().slice(0, 10),
        endDate: initialData.endDate || '',
        prescribedBy: initialData.prescribedBy || '',
        status: initialData.status || 'ACTIVE',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        name: '',
        dosage: '',
        frequency: 'Once Daily (Morning)',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '',
        prescribedBy: '',
        status: 'ACTIVE',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Medicine name is required';
    if (!formData.dosage) newErrors.dosage = 'Dosage is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Medication' : 'Add New Prescription / Medication'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold mb-1">Medication Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Lisinopril, Metformin"
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Dosage *</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g. 10 mg, 500 mg"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
            {errors.dosage && <p className="text-[11px] text-rose-500 mt-1">{errors.dosage}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-1">Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            >
              <option value="Once Daily (Morning)">Once Daily (Morning)</option>
              <option value="Once Daily (Evening)">Once Daily (Evening)</option>
              <option value="Twice Daily">Twice Daily</option>
              <option value="Every 8 Hours">Every 8 Hours</option>
              <option value="As Needed">As Needed (PRN)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
            {errors.startDate && <p className="text-[11px] text-rose-500 mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-1">End Date (Optional)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Prescribed By</label>
            <input
              type="text"
              name="prescribedBy"
              value={formData.prescribedBy}
              onChange={handleChange}
              placeholder="e.g. Dr. Sarah Smith"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="PAUSED">PAUSED</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Instructions / Notes</label>
          <textarea
            name="notes"
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Take with food or glass of water."
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-soft-sm"
          >
            <Save className="w-4 h-4" /> Save Medication
          </button>
        </div>
      </form>
    </Modal>
  );
}
