import axiosClient from './axiosClient';

export const userApi = {
  getProfile: () => axiosClient.get('/users/me'),
  updateProfile: (data) => axiosClient.put('/users/profile', data),
};
