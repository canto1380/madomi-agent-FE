import apiRequest from './api.js';

export const obtenerStats = () => apiRequest('/api/admin/stats');
