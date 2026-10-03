import axiosClient from './axiosClient';

export const alertsApi = {
  getAlerts: (params) => axiosClient.get('/alerts', { params }),
  getRecentAlerts: () => axiosClient.get('/alerts/recent'),
  markRead: (id) => axiosClient.patch(`/alerts/${id}/read`),
};
