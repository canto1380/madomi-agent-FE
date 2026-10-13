import apiRequest from './api.js';

export async function obtenerCategorias() {
  return apiRequest('/api/categorias');
}
