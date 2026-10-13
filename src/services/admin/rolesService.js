import apiRequest from './api.js';

export const listarRoles = () => apiRequest('/api/roles');

export const obtenerRol = (id) => apiRequest(`/api/roles/${id}`);

export const crearRol = (payload) =>
  apiRequest('/api/roles', { method: 'POST', body: JSON.stringify(payload) });

export const actualizarRol = (id, payload) =>
  apiRequest(`/api/roles/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const eliminarRol = (id) =>
  apiRequest(`/api/roles/${id}`, { method: 'DELETE' });

export const sincronizarPermisosRol = (id, permisoIds) =>
  apiRequest(`/api/roles/${id}/permisos`, {
    method: 'PUT',
    body: JSON.stringify({ permisoIds }),
  });
