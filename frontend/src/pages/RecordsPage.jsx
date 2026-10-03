import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../api/healthRecordsApi';
import MainLayout from '../layouts/MainLayout';
import HealthRecordTable from '../components/records/HealthRecordTable';
import HealthRecordFormModal from '../components/records/HealthRecordFormModal';
import Modal from '../components/common/Modal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { exportRecordsToCSV } from '../utils/exportUtils';
import { FileText, Plus } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

export default function RecordsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  const { data: recordsRes, isLoading } = useQuery({
    queryKey: ['healthRecords', page],
    queryFn: () => healthRecordsApi.getRecords({ page, size: 10 }),
    staleTime: 30000,
  });

  const pagedData = recordsRes?.data;

  const createMutation = useMutation({
    mutationFn: (newRecord) => healthRecordsApi.createRecord(newRecord),
    onSuccess: () => {
      queryClient.invalidateQueries(['healthRecords']);
      queryClient.invalidateQueries(['dashboardOverview']);
      setFormModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => healthRecordsApi.updateRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['healthRecords']);
      queryClient.invalidateQueries(['dashboardOverview']);
      setFormModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => healthRecordsApi.deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['healthRecords']);
      queryClient.invalidateQueries(['dashboardOverview']);
    },
  });

  const handleFormSubmit = (formData) => {
    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleExport = () => {
    if (pagedData?.content) {
      exportRecordsToCSV(pagedData.content);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-600" />
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">Health Records Journal</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete historical record of vital signs and body measurements
            </p>
          </div>

          <button
            onClick={() => {
              setEditingRecord(null);
              setFormModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-soft-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Log Vital Signs
          </button>
        </div>

        {/* Table Container */}
        {isLoading ? (
          <SkeletonLoader count={6} type="table" />
        ) : (
          <HealthRecordTable
            records={pagedData?.content || []}
            page={pagedData?.page || 0}
            totalPages={pagedData?.totalPages || 1}
            totalElements={pagedData?.totalElements || 0}
            onPageChange={(newPage) => setPage(newPage)}
            onViewRecord={(rec) => {
              setViewingRecord(rec);
              setDetailsModalOpen(true);
            }}
            onEditRecord={(rec) => {
              setEditingRecord(rec);
              setFormModalOpen(true);
            }}
            onDeleteRecord={(id) => {
              if (window.confirm('Are you sure you want to delete this health record entry?')) {
                deleteMutation.mutate(id);
              }
            }}
            onExportCSV={handleExport}
          />
        )}

        {/* Form Modal */}
        <HealthRecordFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingRecord}
        />

        {/* Details View Modal */}
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title="Health Record Entry Details"
        >
          {viewingRecord && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-bold text-muted-foreground">Recorded At:</span>
                <span className="font-bold text-foreground">{formatDateTime(viewingRecord.recordedAt)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-muted/40">
                  <span className="text-muted-foreground font-semibold">Heart Rate</span>
                  <p className="text-base font-extrabold text-rose-500">{viewingRecord.heartRate || '--'} BPM</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40">
                  <span className="text-muted-foreground font-semibold">Blood Pressure</span>
                  <p className="text-base font-extrabold text-blue-500">{viewingRecord.bloodPressureFormatted || '--'} mmHg</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40">
                  <span className="text-muted-foreground font-semibold">SpO2 Oxygen</span>
                  <p className="text-base font-extrabold text-cyan-500">{viewingRecord.spo2 || '--'} %</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40">
                  <span className="text-muted-foreground font-semibold">Blood Glucose</span>
                  <p className="text-base font-extrabold text-amber-500">{viewingRecord.bloodGlucose || '--'} mg/dL</p>
                </div>
              </div>

              {viewingRecord.notes && (
                <div className="p-3 rounded-2xl bg-muted/20 border border-border/60">
                  <span className="font-bold text-muted-foreground block mb-1">Notes:</span>
                  <p className="text-foreground">{viewingRecord.notes}</p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
