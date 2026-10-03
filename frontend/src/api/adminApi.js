import axiosClient from './axiosClient';

export const adminApi = {
  getSystemMetrics: () => axiosClient.get('/admin/metrics'),
  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  toggleUserActive: (id) => axiosClient.patch(`/admin/users/${id}/toggle-active`),
  updateUserRole: (id, role) => axiosClient.patch(`/admin/users/${id}/role`, null, { params: { role } }),
};
