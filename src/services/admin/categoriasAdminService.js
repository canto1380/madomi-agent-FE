import apiRequest from './api.js';

export const listarCategorias = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/admin/categorias${query ? `?${query}` : ''}`);
};

export const obtenerCategoria = (id) => apiRequest(`/api/admin/categorias/${id}`);

export const crearCategoria = (payload) =>
  apiRequest('/api/admin/categorias', { method: 'POST', body: JSON.stringify(payload) });

export const actualizarCategoria = (id, payload) =>
  apiRequest(`/api/admin/categorias/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const desactivarCategoria = (id) =>
  apiRequest(`/api/admin/categorias/${id}`, { method: 'DELETE' });
