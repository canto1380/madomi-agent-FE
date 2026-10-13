import apiRequest from './api.js';

export const obtenerEmpresaAsistente = () => apiRequest('/api/admin/asistente/empresa');

export const actualizarAsistenteBot = (payload) =>
  apiRequest('/api/admin/asistente/bot', { method: 'PATCH', body: JSON.stringify(payload) });

export const listarContextosAsistente = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/admin/asistente/contexto${query ? `?${query}` : ''}`);
};

export const obtenerContextoVigenteAsistente = (tipo) => {
  const query = new URLSearchParams({ tipo }).toString();
  return apiRequest(`/api/admin/asistente/contexto/vigente?${query}`);
};
