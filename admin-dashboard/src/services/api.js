import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Incidents API
export const incidentsApi = {
  getAll: (filters = {}) => apiClient.get('/incidents', { params: filters }),
  getById: (id) => apiClient.get(`/incidents/${id}`),
  create: (data) => apiClient.post('/incidents', data),
  flag: (id, reason) => apiClient.patch(`/incidents/${id}/flag`, { flagged_reason: reason }),
};

// Complaints API
export const complaintsApi = {
  getAll: () => apiClient.get('/complaints'),
  getById: (id) => apiClient.get(`/complaints/${id}`),
  updateStatus: (id, status, findings) =>
    apiClient.patch(`/complaints/${id}/status`, { status, findings }),
};

// Users API
export const usersApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.patch(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

// Auth API
export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
};
