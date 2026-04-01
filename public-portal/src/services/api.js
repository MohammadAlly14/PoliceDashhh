import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Complaints API (Public)
export const complaintsApi = {
  submitComplaint: (data) => apiClient.post('/complaints', data),
  uploadEvidence: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('evidence', file));

    return apiClient.post('/complaints/evidence', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getComplaints: () => apiClient.get('/complaints'),
  getComplaintStatus: (id) => apiClient.get(`/complaints/${id}/status`),
  getComplaintDetails: (id) => apiClient.get(`/complaints/${id}`),
};
