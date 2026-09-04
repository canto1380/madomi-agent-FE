import apiRequest from './api.js';
import { PRODUCTOS_ESTATICOS } from '../constants/constants.js';

/**
 * Contrato API: GET /api/productos → { data: Producto[] }
 * Producto: { id, nombre, categoria?, imagenUrl?, descripcion? }
 *
 * Si la API no está disponible, devuelve productos estáticos del proyecto.
 */
export async function obtenerProductos() {
  try {
    const productos = await apiRequest('/api/productos');
    if (Array.isArray(productos) && productos.length > 0) {
      return productos;
    }
    return PRODUCTOS_ESTATICOS;
  } catch {
    return PRODUCTOS_ESTATICOS;
  }
}
