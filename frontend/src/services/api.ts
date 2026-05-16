import axios from 'axios';
import { ApiResponse, Lead, LeadFilters, User } from '../types';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
};

export const leadsApi = {
  getAll: (filters: LeadFilters = {}) =>
    api.get<ApiResponse<Lead[]>>('/leads', { params: filters }),
  getOne: (id: string) => api.get<ApiResponse<Lead>>(`/leads/${id}`),
  create: (data: Partial<Lead>) => api.post<ApiResponse<Lead>>('/leads', data),
  update: (id: string, data: Partial<Lead>) => api.put<ApiResponse<Lead>>(`/leads/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/leads/${id}`),
  exportCSV: (filters: Omit<LeadFilters, 'page' | 'sort'> = {}) =>
    api.get('/leads/export', { params: filters, responseType: 'blob' }),
};

export default api;
