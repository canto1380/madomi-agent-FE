import apiRequest from './api.js';
import { LO_ULTIMO } from '../constants/loUltimo.js';

export async function obtenerDestacados(seccion = 'lo_ultimo') {
  try {
    const data = await apiRequest(`/api/productos/destacados?seccion=${encodeURIComponent(seccion)}`);
    return Array.isArray(data) ? data : [];
  } catch {
    if (seccion === 'lo_ultimo') {
      return LO_ULTIMO.productos;
    }
    return [];
  }
}
