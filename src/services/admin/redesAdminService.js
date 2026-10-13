import apiRequest from './api.js';

export const listarRedes = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/admin/redes${query ? `?${query}` : ''}`);
};

export const obtenerRed = (id) => apiRequest(`/api/admin/redes/${id}`);

export const crearRed = (payload) =>
  apiRequest('/api/admin/redes', { method: 'POST', body: JSON.stringify(payload) });

export const actualizarRed = (id, payload) =>
  apiRequest(`/api/admin/redes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const desactivarRed = (id) =>
  apiRequest(`/api/admin/redes/${id}`, { method: 'DELETE' });
