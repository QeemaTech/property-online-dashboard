import api from '../lib/axios';

export const login = (data) => api.post('/admin/auth/login', data);
export const getProfile = () => api.get('/admin/auth/me');
export const updatePreferences = (data) => api.put('/admin/auth/preferences', data);
export const changePassword = (data) => api.put('/admin/auth/change-password', data);
export const logout = () => api.post('/admin/auth/logout');
