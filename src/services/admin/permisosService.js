import apiRequest from './api.js';

export const listarPermisos = () => apiRequest('/api/permisos');

export const obtenerPermiso = (id) => apiRequest(`/api/permisos/${id}`);

export const crearPermiso = (payload) =>
  apiRequest('/api/permisos', { method: 'POST', body: JSON.stringify(payload) });

export const actualizarPermiso = (id, payload) =>
  apiRequest(`/api/permisos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const eliminarPermiso = (id) =>
  apiRequest(`/api/permisos/${id}`, { method: 'DELETE' });
