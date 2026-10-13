export function buildAdminListParams(filters = {}, sort = {}) {
  const params = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.estado === 'activo') {
    params.activo = 'true';
  } else if (filters.estado === 'inactivo') {
    params.activo = 'false';
  }

  if (filters.categoria?.trim()) {
    params.categoria = filters.categoria.trim();
  }

  if (filters.seccion?.trim()) {
    params.seccion = filters.seccion.trim();
  }

  if (filters.tipo?.trim()) {
    params.tipo = filters.tipo.trim();
  }

  if (sort.key && sort.direction) {
    params.sort = sort.key;
    params.order = sort.direction;
  }

  return params;
}
