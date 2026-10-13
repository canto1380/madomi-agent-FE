import apiRequest from './api.js';

export const listarUsuarios = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/usuarios${query ? `?${query}` : ''}`);
};

export const obtenerUsuario = (id) => apiRequest(`/api/usuarios/${id}`);

export const crearUsuario = (payload) =>
  apiRequest('/api/usuarios', { method: 'POST', body: JSON.stringify(payload) });

export const actualizarUsuario = (id, payload) =>
  apiRequest(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const eliminarUsuario = (id) =>
  apiRequest(`/api/usuarios/${id}`, { method: 'DELETE' });

export const reactivarUsuario = (id) =>
  apiRequest(`/api/usuarios/${id}/reactivar`, { method: 'PUT' });

export const cambiarRolUsuario = (id, rolId) =>
  apiRequest(`/api/usuarios/${id}/rol`, {
    method: 'PUT',
    body: JSON.stringify({ rolId }),
  });
