import axiosClient from './axiosClient';

export const appointmentsApi = {
  getAppointments: (params) => axiosClient.get('/appointments', { params }),
  bookAppointment: (data) => axiosClient.post('/appointments', data),
  updateStatus: (id, params) => axiosClient.patch(`/appointments/${id}/status`, null, { params }),
  cancelAppointment: (id) => axiosClient.delete(`/appointments/${id}`),
};
