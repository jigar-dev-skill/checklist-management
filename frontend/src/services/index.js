import api from './api';

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  forgotPassword: (data) => api.post('/forgot-password', data),
  resetPassword: (data) => api.post('/reset-password', data),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  get: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  changePassword: (id, data) => api.post(`/users/${id}/change-password`, data),
};

export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  create: (data) => api.post('/patients', data),
  get: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

export const templateAPI = {
  getAll: (params) => api.get('/checklist-templates', { params }),
  create: (data) => api.post('/checklist-templates', data),
  get: (id) => api.get(`/checklist-templates/${id}`),
  update: (id, data) => api.put(`/checklist-templates/${id}`, data),
  delete: (id) => api.delete(`/checklist-templates/${id}`),
};

export const checklistAPI = {
  getAll: (params) => api.get('/checklists', { params }),
  create: (data) => api.post('/checklists', data),
  get: (id) => api.get(`/checklists/${id}`),
  update: (id, data) => api.put(`/checklists/${id}`, data),
  delete: (id) => api.delete(`/checklists/${id}`),
  submitResponses: (id, data) => api.post(`/checklists/${id}/submit-responses`, data),
  complete: (id, data) => api.post(`/checklists/${id}/complete`, data),
};

export const dashboardAPI = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getDoctorDashboard: () => api.get('/dashboard/doctor'),
};

export const reportAPI = {
  getReports: (params) => api.get('/reports', { params }),
  exportPDF: (params) => api.get('/reports/export-pdf', { params }),
  exportExcel: (params) => api.get('/reports/export-excel', { params }),
};

const apis = {
  authAPI,
  userAPI,
  patientAPI,
  templateAPI,
  checklistAPI,
  dashboardAPI,
  reportAPI,
};

export default apis;
