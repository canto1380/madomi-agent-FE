export function buildCrmListParams({ filters = {}, sort = {}, page = 1, limit = 20 } = {}) {
  const params = { page, limit };

  if (filters.nombre?.trim()) {
    params.nombre = filters.nombre.trim();
  }
  if (filters.telefono?.trim()) {
    params.telefono = filters.telefono.trim();
  }
  if (filters.localidad?.trim()) {
    params.localidad = filters.localidad.trim();
  }
  if (filters.estado && filters.estado !== 'todos') {
    params.estado = filters.estado;
  }
  if (filters.estadoLogistico && filters.estadoLogistico !== 'todos') {
    params.estadoLogistico = filters.estadoLogistico;
  }
  if (filters.estadoPresupuesto && filters.estadoPresupuesto !== 'todos') {
    params.estado = filters.estadoPresupuesto;
  }
  if (filters.desde?.trim()) {
    params.desde = filters.desde.trim();
  }
  if (filters.hasta?.trim()) {
    params.hasta = filters.hasta.trim();
  }
  if (filters.leadId?.trim()) {
    params.leadId = filters.leadId.trim();
  }
  if (filters.clienteId?.trim()) {
    params.clienteId = filters.clienteId.trim();
  }

  if (sort.key && sort.direction) {
    params.sort = sort.key;
    params.order = sort.direction;
  }

  return params;
}
