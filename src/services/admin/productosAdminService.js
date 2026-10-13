import apiRequest from './api.js';

export const listarProductos = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/admin/productos${query ? `?${query}` : ''}`);
};

export const obtenerProducto = (id) => apiRequest(`/api/admin/productos/${id}`);

export const crearProducto = (payload) =>
  apiRequest('/api/admin/productos', { method: 'POST', body: JSON.stringify(payload) });

export const actualizarProducto = (id, payload) =>
  apiRequest(`/api/admin/productos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const desactivarProducto = (id) =>
  apiRequest(`/api/admin/productos/${id}`, { method: 'DELETE' });
