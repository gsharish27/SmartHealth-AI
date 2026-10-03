import axiosClient from './axiosClient';

export const doctorsApi = {
  getActiveDoctors: () => axiosClient.get('/doctor/doctors'),
  getDoctorPatients: (params) => axiosClient.get('/doctor/patients', { params }),
  getPatientOverview: (patientId) => axiosClient.get(`/doctor/patients/${patientId}/overview`),
  grantAccess: (doctorId) => axiosClient.post('/doctor/access/grant', null, { params: { doctorId } }),
};
