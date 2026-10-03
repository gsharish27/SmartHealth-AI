import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import MainLayout from '../layouts/MainLayout';
import Modal from '../components/common/Modal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { User, Phone, Mail, Calendar, ShieldAlert, Heart, Edit2, Save } from 'lucide-react';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userApi.getProfile(),
  });

  const userData = profileRes?.data;
  const profile = userData?.profile;

  const [formData, setFormData] = useState({});

  const openEditModal = () => {
    setFormData({
      fullName: userData?.fullName || '',
      phoneNumber: userData?.phoneNumber || '',
      avatarUrl: userData?.avatarUrl || '',
      dateOfBirth: profile?.dateOfBirth || '',
      gender: profile?.gender || 'Male',
      bloodGroup: profile?.bloodGroup || 'O+',
      heightCm: profile?.heightCm || '',
      weightKg: profile?.weightKg || '',
      emergencyContactName: profile?.emergencyContactName || '',
      emergencyContactRelationship: profile?.emergencyContactRelationship || '',
      emergencyContactPhone: profile?.emergencyContactPhone || '',
      allergies: profile?.allergies || '',
      medicalHistory: profile?.medicalHistory || '',
    });
    setEditModalOpen(true);
  };

  const updateMutation = useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile']);
      setEditModalOpen(false);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <SkeletonLoader count={3} type="card" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profile Banner */}
        <div className="relative rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-soft-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={userData?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={userData?.fullName}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-sky-500/20 shadow-soft-md shrink-0"
            />

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-extrabold text-foreground">{userData?.fullName}</h1>
                  <p className="text-xs text-muted-foreground font-medium">{userData?.email}</p>
                </div>
                <button
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-soft-sm transition-all self-center sm:self-auto"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 pt-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20">
                  Blood Group: {profile?.bloodGroup || 'O+'}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                  Age: {profile?.age ? `${profile.age} yrs` : 'N/A'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Gender: {profile?.gender || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Physical & Vital Parameters Card */}
          <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-soft-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Heart className="w-4 h-4 text-sky-600" /> Physical & Baseline Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground font-semibold">Height:</span>
                <p className="text-sm font-extrabold text-foreground">{profile?.heightCm ? `${profile.heightCm} cm` : 'Not set'}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Weight:</span>
                <p className="text-sm font-extrabold text-foreground">{profile?.weightKg ? `${profile.weightKg} kg` : 'Not set'}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Date of Birth:</span>
                <p className="text-sm font-extrabold text-foreground">{profile?.dateOfBirth || 'Not set'}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Phone Number:</span>
                <p className="text-sm font-extrabold text-foreground">{userData?.phoneNumber || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-soft-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Phone className="w-4 h-4 text-rose-500" /> Emergency Contact Info
            </h3>
            <div className="space-y-2">
              <p><strong className="text-muted-foreground font-semibold">Contact Name:</strong> <span className="font-extrabold text-foreground">{profile?.emergencyContactName || 'None listed'}</span></p>
              <p><strong className="text-muted-foreground font-semibold">Relationship:</strong> <span className="font-extrabold text-foreground">{profile?.emergencyContactRelationship || 'N/A'}</span></p>
              <p><strong className="text-muted-foreground font-semibold">Phone:</strong> <span className="font-extrabold text-foreground">{profile?.emergencyContactPhone || 'N/A'}</span></p>
            </div>
          </div>

          {/* Allergies Card */}
          <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-soft-sm space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Known Allergies
            </h3>
            <p className="text-foreground leading-relaxed font-medium">
              {profile?.allergies || 'No known drug or food allergies recorded.'}
            </p>
          </div>

          {/* Medical History Card */}
          <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-soft-sm space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <User className="w-4 h-4 text-purple-500" /> Chronic Medical History
            </h3>
            <p className="text-foreground leading-relaxed font-medium">
              {profile?.medicalHistory || 'No prior chronic conditions recorded.'}
            </p>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Medical Profile & Vitals"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Gender</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Blood Group</label>
                <input
                  type="text"
                  value={formData.bloodGroup || ''}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.heightCm || ''}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weightKg || ''}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContactName || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Relationship</label>
                <input
                  type="text"
                  value={formData.emergencyContactRelationship || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Allergies</label>
              <textarea
                rows={2}
                value={formData.allergies || ''}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Medical History</label>
              <textarea
                rows={2}
                value={formData.medicalHistory || ''}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 text-white font-bold"
              >
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}
