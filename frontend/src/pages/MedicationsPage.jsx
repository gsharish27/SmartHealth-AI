import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationsApi } from '../api/medicationsApi';
import MainLayout from '../layouts/MainLayout';
import MedicationCard from '../components/medications/MedicationCard';
import MedicationFormModal from '../components/medications/MedicationFormModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { Pill, Plus } from 'lucide-react';

export default function MedicationsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const { data: medsRes, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationsApi.getMedications({ size: 50 }),
  });

  const medications = medsRes?.data?.content || [];

  const createMutation = useMutation({
    mutationFn: (data) => medicationsApi.createMedication(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['medications']);
      queryClient.invalidateQueries(['dashboardOverview']);
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => medicationsApi.updateMedication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['medications']);
      queryClient.invalidateQueries(['dashboardOverview']);
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => medicationsApi.deleteMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['medications']);
      queryClient.invalidateQueries(['dashboardOverview']);
    },
  });

  const markTakenMutation = useMutation({
    mutationFn: (scheduleId) => medicationsApi.markTaken(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries(['medications']);
      queryClient.invalidateQueries(['dashboardOverview']);
    },
  });

  const handleFormSubmit = (data) => {
    if (editingMed) {
      updateMutation.mutate({ id: editingMed.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-amber-500" />
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">Medication Management</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track prescription dosages, schedule timers, and log taken doses
            </p>
          </div>

          <button
            onClick={() => {
              setEditingMed(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-soft-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Prescription
          </button>
        </div>

        {isLoading ? (
          <SkeletonLoader count={4} type="card" />
        ) : medications.length === 0 ? (
          <EmptyState
            title="No Medications Registered"
            description="Add your daily prescription routines to receive reminders and log dosage history."
            actionLabel="Add Prescription"
            onAction={() => setModalOpen(true)}
            icon={Pill}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onMarkTaken={(schedId) => markTakenMutation.mutate(schedId)}
                onEdit={(m) => {
                  setEditingMed(m);
                  setModalOpen(true);
                }}
                onDelete={(id) => {
                  if (window.confirm('Remove this prescription entry?')) {
                    deleteMutation.mutate(id);
                  }
                }}
              />
            ))}
          </div>
        )}

        <MedicationFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingMed}
        />
      </div>
    </MainLayout>
  );
}
