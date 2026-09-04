import { LO_ULTIMO } from '../constants/loUltimo.js';

/**
 * Combina la lista editorial de "Lo último" con datos de la API cuando existen.
 */
export function resolverLoUltimo(productos = []) {
  const indice = new Map(
    (productos ?? []).map((producto) => [String(producto.id), producto]),
  );

  return LO_ULTIMO.productos.map((destacado) => {
    const remoto = indice.get(String(destacado.id));
    if (!remoto) return destacado;

    return {
      ...destacado,
      ...remoto,
      nombre: destacado.nombre,
      descripcion: remoto.descripcion ?? destacado.descripcion,
      categoria: remoto.categoria ?? destacado.categoria,
    };
  });
}
