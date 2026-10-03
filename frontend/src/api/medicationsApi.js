import axiosClient from './axiosClient';

export const medicationsApi = {
  getMedications: (params) => axiosClient.get('/medications', { params }),
  getUpcoming: () => axiosClient.get('/medications/upcoming'),
  createMedication: (data) => axiosClient.post('/medications', data),
  updateMedication: (id, data) => axiosClient.put(`/medications/${id}`, data),
  deleteMedication: (id) => axiosClient.delete(`/medications/${id}`),
  markTaken: (scheduleId) => axiosClient.post(`/medications/schedules/${scheduleId}/take`),
};
