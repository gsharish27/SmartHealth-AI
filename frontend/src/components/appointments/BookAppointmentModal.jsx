import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Calendar, Stethoscope, Save } from 'lucide-react';

export default function BookAppointmentModal({ isOpen, onClose, onSubmit, activeDoctors = [] }) {
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    hospitalName: '',
    appointmentDate: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  const handleDoctorSelect = (e) => {
    const docId = e.target.value;
    if (docId) {
      const selected = activeDoctors.find((d) => String(d.id) === String(docId));
      setFormData((prev) => ({
        ...prev,
        doctorId: docId,
        doctorName: selected ? selected.fullName : prev.doctorName,
        hospitalName: selected ? selected.hospitalAffinity || 'St. Jude Memorial Hospital' : prev.hospitalName,
      }));
    } else {
      setFormData((prev) => ({ ...prev, doctorId: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.doctorName) newErrors.doctorName = 'Doctor name is required';
    if (!formData.hospitalName) newErrors.hospitalName = 'Hospital name is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date & time required';
    if (!formData.reason) newErrors.reason = 'Reason for appointment required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      doctorId: formData.doctorId ? parseInt(formData.doctorId) : null,
      doctorName: formData.doctorName,
      hospitalName: formData.hospitalName,
      appointmentDate: new Date(formData.appointmentDate).toISOString(),
      reason: formData.reason,
    };

    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Medical Appointment">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {activeDoctors && activeDoctors.length > 0 && (
          <div>
            <label className="block font-semibold mb-1">Select Physician (Or Enter Below)</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleDoctorSelect}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            >
              <option value="">-- Choose From Network Physicians --</option>
              {activeDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.fullName} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1">Doctor Name *</label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            placeholder="e.g. Dr. Sarah Smith, MD"
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
          />
          {errors.doctorName && <p className="text-[11px] text-rose-500 mt-1">{errors.doctorName}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Hospital / Clinic *</label>
          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            placeholder="e.g. St. Jude Memorial Hospital - Suite 402"
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
          />
          {errors.hospitalName && <p className="text-[11px] text-rose-500 mt-1">{errors.hospitalName}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Appointment Date & Time *</label>
          <input
            type="datetime-local"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
          />
          {errors.appointmentDate && <p className="text-[11px] text-rose-500 mt-1">{errors.appointmentDate}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Reason for Visit *</label>
          <textarea
            name="reason"
            rows={3}
            value={formData.reason}
            onChange={handleChange}
            placeholder="e.g. Routine blood pressure checkup and prescription refill."
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500 resize-none"
          />
          {errors.reason && <p className="text-[11px] text-rose-500 mt-1">{errors.reason}</p>}
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
            <Save className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </form>
    </Modal>
  );
}
