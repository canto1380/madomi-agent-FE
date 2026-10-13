import apiRequest from './api.js';

export const listarMedia = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/admin/media${query ? `?${query}` : ''}`);
};

export const obtenerMedia = (id) => apiRequest(`/api/admin/media/${id}`);

export const crearMedia = (payload) =>
  apiRequest('/api/admin/media', { method: 'POST', body: JSON.stringify(payload) });

export const actualizarMedia = (id, payload) =>
  apiRequest(`/api/admin/media/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const desactivarMedia = (id) =>
  apiRequest(`/api/admin/media/${id}`, { method: 'DELETE' });
