import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointmentsApi';
import { doctorsApi } from '../api/doctorsApi';
import MainLayout from '../layouts/MainLayout';
import AppointmentCard from '../components/appointments/AppointmentCard';
import BookAppointmentModal from '../components/appointments/BookAppointmentModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { CalendarDays, Plus, Calendar as CalendarIcon } from 'lucide-react';

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: appRes, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsApi.getAppointments({ size: 50 }),
  });

  const { data: doctorsRes } = useQuery({
    queryKey: ['activeDoctors'],
    queryFn: () => doctorsApi.getActiveDoctors(),
  });

  const appointments = appRes?.data?.content || [];
  const doctors = doctorsRes?.data || [];

  const bookMutation = useMutation({
    mutationFn: (data) => appointmentsApi.bookAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      queryClient.invalidateQueries(['dashboardOverview']);
      setModalOpen(false);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => appointmentsApi.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      queryClient.invalidateQueries(['dashboardOverview']);
    },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">Appointment Management</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Book consultations with healthcare professionals and review past visits
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-soft-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        </div>

        {isLoading ? (
          <SkeletonLoader count={4} type="card" />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No Appointments Scheduled"
            description="Book your next consultation or checkup with network doctors."
            actionLabel="Schedule Appointment"
            onAction={() => setModalOpen(true)}
            icon={CalendarIcon}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                onCancel={(id) => {
                  if (window.confirm('Are you sure you want to cancel this appointment?')) {
                    cancelMutation.mutate(id);
                  }
                }}
              />
            ))}
          </div>
        )}

        <BookAppointmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={(data) => bookMutation.mutate(data)}
          activeDoctors={doctors}
        />
      </div>
    </MainLayout>
  );
}
