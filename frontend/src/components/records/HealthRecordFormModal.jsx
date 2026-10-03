import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Heart, Activity, Wind, Droplet, Thermometer, Scale, Calendar, Save } from 'lucide-react';

export default function HealthRecordFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    heartRate: '',
    systolicBp: '',
    diastolicBp: '',
    spo2: '',
    bloodGlucose: '',
    bodyTemperature: '',
    weightKg: '',
    heightCm: '',
    sleepHours: '',
    steps: '',
    notes: '',
    recordedAt: new Date().toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        heartRate: initialData.heartRate || '',
        systolicBp: initialData.systolicBp || '',
        diastolicBp: initialData.diastolicBp || '',
        spo2: initialData.spo2 || '',
        bloodGlucose: initialData.bloodGlucose || '',
        bodyTemperature: initialData.bodyTemperature || '',
        weightKg: initialData.weightKg || '',
        heightCm: initialData.heightCm || '',
        sleepHours: initialData.sleepHours || '',
        steps: initialData.steps || '',
        notes: initialData.notes || '',
        recordedAt: initialData.recordedAt ? new Date(initialData.recordedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        heartRate: '',
        systolicBp: '',
        diastolicBp: '',
        spo2: '',
        bloodGlucose: '',
        bodyTemperature: '',
        weightKg: '',
        heightCm: '',
        sleepHours: '',
        steps: '',
        notes: '',
        recordedAt: new Date().toISOString().slice(0, 16),
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.heartRate && (formData.heartRate < 30 || formData.heartRate > 250)) {
      newErrors.heartRate = 'Heart rate must be between 30 and 250 BPM';
    }
    if (formData.systolicBp && (formData.systolicBp < 60 || formData.systolicBp > 260)) {
      newErrors.systolicBp = 'Systolic BP must be between 60 and 260 mmHg';
    }
    if (formData.diastolicBp && (formData.diastolicBp < 40 || formData.diastolicBp > 160)) {
      newErrors.diastolicBp = 'Diastolic BP must be between 40 and 160 mmHg';
    }
    if (formData.spo2 && (formData.spo2 < 50 || formData.spo2 > 100)) {
      newErrors.spo2 = 'SpO2 must be between 50% and 100%';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
      systolicBp: formData.systolicBp ? parseInt(formData.systolicBp) : null,
      diastolicBp: formData.diastolicBp ? parseInt(formData.diastolicBp) : null,
      spo2: formData.spo2 ? parseInt(formData.spo2) : null,
      bloodGlucose: formData.bloodGlucose ? parseFloat(formData.bloodGlucose) : null,
      bodyTemperature: formData.bodyTemperature ? parseFloat(formData.bodyTemperature) : null,
      weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
      heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
      sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : null,
      steps: formData.steps ? parseInt(formData.steps) : null,
      notes: formData.notes,
      recordedAt: formData.recordedAt ? new Date(formData.recordedAt).toISOString() : null,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Health Record' : 'Log Vital Signs & Measurements'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vital Signs Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-3 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" /> Vital Signs
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Heart Rate (BPM)</label>
              <input
                type="number"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleChange}
                placeholder="e.g. 72"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
              {errors.heartRate && <p className="text-[11px] text-rose-500 mt-1">{errors.heartRate}</p>}
            </div>

            <div>
              <label className="block font-semibold mb-1">SpO2 Oxygen (%)</label>
              <input
                type="number"
                name="spo2"
                value={formData.spo2}
                onChange={handleChange}
                placeholder="e.g. 98"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
              {errors.spo2 && <p className="text-[11px] text-rose-500 mt-1">{errors.spo2}</p>}
            </div>

            <div>
              <label className="block font-semibold mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                name="systolicBp"
                value={formData.systolicBp}
                onChange={handleChange}
                placeholder="e.g. 120"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
              {errors.systolicBp && <p className="text-[11px] text-rose-500 mt-1">{errors.systolicBp}</p>}
            </div>

            <div>
              <label className="block font-semibold mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                name="diastolicBp"
                value={formData.diastolicBp}
                onChange={handleChange}
                placeholder="e.g. 80"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
              {errors.diastolicBp && <p className="text-[11px] text-rose-500 mt-1">{errors.diastolicBp}</p>}
            </div>

            <div>
              <label className="block font-semibold mb-1">Blood Glucose (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                name="bloodGlucose"
                value={formData.bloodGlucose}
                onChange={handleChange}
                placeholder="e.g. 95.5"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Body Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                name="bodyTemperature"
                value={formData.bodyTemperature}
                onChange={handleChange}
                placeholder="e.g. 36.6"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Body Measurements Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-purple-500" /> Body Measurements & Activity
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleChange}
                placeholder="e.g. 75.2"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                name="heightCm"
                value={formData.heightCm}
                onChange={handleChange}
                placeholder="e.g. 178.5"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Sleep (hours)</label>
              <input
                type="number"
                step="0.5"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleChange}
                placeholder="e.g. 7.5"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Daily Steps</label>
              <input
                type="number"
                name="steps"
                value={formData.steps}
                onChange={handleChange}
                placeholder="e.g. 10250"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Meta Section */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Measurement Date & Time</label>
            <input
              type="datetime-local"
              name="recordedAt"
              value={formData.recordedAt}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Notes / Context</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Measured after 15 mins rest in morning."
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-soft-sm"
          >
            <Save className="w-4 h-4" /> Save Record
          </button>
        </div>
      </form>
    </Modal>
  );
}
