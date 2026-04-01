import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Complaints API (Public)
export const complaintsApi = {
  submitComplaint: (data) => apiClient.post('/complaints', data),
  getComplaints: () => apiClient.get('/complaints'),
  getComplaintStatus: (id) => apiClient.get(`/complaints/${id}/status`),
  getComplaintDetails: (id) => apiClient.get(`/complaints/${id}`),
};
