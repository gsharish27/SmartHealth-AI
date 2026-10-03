import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import SkeletonLoader from '../components/common/SkeletonLoader';

// Route-based Code Splitting using React.lazy()
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const RecordsPage = lazy(() => import('../pages/RecordsPage'));
const MedicationsPage = lazy(() => import('../pages/MedicationsPage'));
const AppointmentsPage = lazy(() => import('../pages/AppointmentsPage'));
const AlertsPage = lazy(() => import('../pages/AlertsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const DoctorDashboardPage = lazy(() => import('../pages/DoctorDashboardPage'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-8 max-w-7xl mx-auto"><SkeletonLoader count={4} type="card" /></div>}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Patient Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Doctor Portal Role Route */}
          <Route element={<RoleRoute requiredRoles={['ROLE_DOCTOR', 'ROLE_ADMIN']} />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
          </Route>

          {/* Admin Portal Role Route */}
          <Route element={<RoleRoute requiredRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
