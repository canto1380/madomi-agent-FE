import apiRequest from './api.js';

export const listarContenido = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/admin/contenido${query ? `?${query}` : ''}`);
};

export const obtenerContenido = (id) => apiRequest(`/api/admin/contenido/${id}`);

export const crearContenido = (payload) =>
  apiRequest('/api/admin/contenido', { method: 'POST', body: JSON.stringify(payload) });

export const actualizarContenido = (id, payload) =>
  apiRequest(`/api/admin/contenido/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const desactivarContenido = (id) =>
  apiRequest(`/api/admin/contenido/${id}`, { method: 'DELETE' });
