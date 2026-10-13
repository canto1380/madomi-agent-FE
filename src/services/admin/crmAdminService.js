import apiRequest from './api.js';

function queryString(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return '';
  return `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}`;
}

export const obtenerStatsResumenCrm = () => apiRequest('/api/admin/crm/stats/resumen');

export const obtenerStatsCuelloBotellaCrm = () => apiRequest('/api/admin/crm/stats/cuello-botella');

export const listarLeadsCrm = (params = {}) =>
  apiRequest(`/api/admin/crm/leads${queryString(params)}`);

export const obtenerLeadCrm = (id) => apiRequest(`/api/admin/crm/leads/${id}`);

export const actualizarLeadCrm = (id, payload) =>
  apiRequest(`/api/admin/crm/leads/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const obtenerConversacionCrm = (id) => apiRequest(`/api/admin/crm/conversaciones/${id}`);

export const listarPresupuestosCrm = (params = {}) =>
  apiRequest(`/api/admin/crm/presupuestos${queryString(params)}`);

export const listarPedidosCrm = (params = {}) =>
  apiRequest(`/api/admin/crm/pedidos${queryString(params)}`);

export const actualizarPedidoCrm = (id, payload) =>
  apiRequest(`/api/admin/crm/pedidos/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const publicarContextoCrm = (payload) =>
  apiRequest('/api/admin/crm/contexto/publicar', { method: 'POST', body: JSON.stringify(payload) });
