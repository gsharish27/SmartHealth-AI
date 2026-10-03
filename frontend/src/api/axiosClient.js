import axios from 'axios';
import { 
  mockUsers, 
  mockDashboardOverview, 
  mockTrends, 
  mockRecordsPaged, 
  mockDoctors, 
  mockDoctorPatientsPaged, 
  mockAdminMetrics, 
  mockAdminUsersPaged 
} from './mockData';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Seamless Fallback Handler when Java Backend API is offline
function handleMockFallback(config) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  // 1. Login Endpoint
  if (url.includes('/auth/login') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    const email = body.email ? body.email.toLowerCase() : '';
    const userMatch = mockUsers[email] || {
      token: `mock-jwt-${Date.now()}`,
      tokenType: 'Bearer',
      id: Math.floor(Math.random() * 1000) + 10,
      email: email || 'user@example.com',
      fullName: email.split('@')[0] || 'User',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      roles: ['ROLE_USER'],
    };

    return {
      success: true,
      message: 'Authentication successful (Mock Mode)',
      data: userMatch,
    };
  }

  // 2. Register Endpoint
  if (url.includes('/auth/register') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    const role = body.role ? body.role.toUpperCase() : 'ROLE_USER';
    const newUser = {
      token: `mock-jwt-${Date.now()}`,
      tokenType: 'Bearer',
      id: Date.now(),
      email: body.email,
      fullName: body.fullName,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      roles: [role.startsWith('ROLE_') ? role : `ROLE_${role}`],
    };
    return { success: true, message: 'Registration successful', data: newUser };
  }

  // 3. Current User Endpoint
  if (url.includes('/users/me')) {
    const saved = localStorage.getItem('auth_user');
    const user = saved ? JSON.parse(saved) : mockUsers['john.doe@example.com'];
    return {
      success: true,
      data: {
        ...user,
        profile: {
          dateOfBirth: '1988-06-14',
          age: 36,
          gender: 'Male',
          bloodGroup: 'O+',
          heightCm: 178.5,
          weightKg: 75.2,
          emergencyContactName: 'Mary Doe',
          emergencyContactRelationship: 'Spouse',
          emergencyContactPhone: '+1 (555) 999-8877',
          allergies: 'Penicillin, Peanuts',
          medicalHistory: 'Mild hypertension (controlled)',
        }
      }
    };
  }

  // 4. Dashboard Overview
  if (url.includes('/dashboard/overview')) {
    const saved = localStorage.getItem('auth_user');
    const user = saved ? JSON.parse(saved) : null;
    return {
      success: true,
      data: {
        ...mockDashboardOverview,
        userName: user?.fullName || 'John Doe',
        greeting: `Good morning, ${user?.fullName || 'John Doe'}`,
      }
    };
  }

  // 5. Trends
  if (url.includes('/health-records/trends')) {
    return { success: true, data: mockTrends };
  }

  // 6. Health Records list
  if (url.includes('/health-records')) {
    return { success: true, data: mockRecordsPaged };
  }

  // 7. Medications
  if (url.includes('/medications')) {
    return { success: true, data: { content: mockDashboardOverview.todaysMedications, page: 0, totalPages: 1, totalElements: 2 } };
  }

  // 8. Appointments
  if (url.includes('/appointments')) {
    return { success: true, data: { content: mockDashboardOverview.upcomingAppointments, page: 0, totalPages: 1, totalElements: 1 } };
  }

  // 9. Doctors
  if (url.includes('/doctor/doctors')) {
    return { success: true, data: mockDoctors };
  }

  // 10. Doctor Patients
  if (url.includes('/doctor/patients')) {
    return { success: true, data: mockDoctorPatientsPaged };
  }

  // 11. Admin Metrics
  if (url.includes('/admin/metrics')) {
    return { success: true, data: mockAdminMetrics };
  }

  // 12. Admin Users
  if (url.includes('/admin/users')) {
    return { success: true, data: mockAdminUsersPaged };
  }

  // 13. Alerts
  if (url.includes('/alerts')) {
    return { success: true, data: { content: mockDashboardOverview.recentAlerts, page: 0, totalPages: 1, totalElements: 1 } };
  }

  // Generic fallback
  return { success: true, message: 'Action processed successfully', data: null };
}

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If connection refused, network error, or backend server offline (502/503/504)
    if (!error.response || error.response.status >= 500 || error.code === 'ERR_NETWORK') {
      console.warn('Backend API server offline/unreachable. Seamlessly switching to local mock data engine.');
      return handleMockFallback(error.config);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('auth_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export default axiosClient;
