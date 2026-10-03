import axiosClient from './axiosClient';

export const healthRecordsApi = {
  getOverview: () => axiosClient.get('/dashboard/overview'),
  getRecords: (params) => axiosClient.get('/health-records', { params }),
  getTrends: (params) => axiosClient.get('/health-records/trends', { params }),
  getRecordById: (id) => axiosClient.get(`/health-records/${id}`),
  createRecord: (data) => axiosClient.post('/health-records', data),
  updateRecord: (id, data) => axiosClient.put(`/health-records/${id}`, data),
  deleteRecord: (id) => axiosClient.delete(`/health-records/${id}`),
};
