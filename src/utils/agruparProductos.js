const FALLBACK_ORDEN = [
  'Capellettis',
  'Ravioles',
  'Sorrentinos',
  'Fideos',
  'Tallarines',
  'Ñoquis',
  'Noquis',
  'Discos de empanadas',
  'Tapas',
  'Tapas de pascualinas',
  'Masa para tacos',
  'Prepizzas',
  'Pan rallado',
  'Bondiola',
  'Guisos',
  'Humita',
];

function resolverOrden(categoriasOrden = []) {
  const mapa = new Map();

  categoriasOrden.forEach((categoria, index) => {
    if (categoria?.nombre) {
      mapa.set(categoria.nombre, categoria.orden ?? index);
    }
  });

  return mapa;
}

export function agruparPorCategoria(productos, categoriasOrden = []) {
  if (!productos?.length) return [];

  const grupos = productos.reduce((acc, producto) => {
    const categoria = producto.categoria || 'Otros';
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(producto);
    return acc;
  }, {});

  const ordenMap = resolverOrden(categoriasOrden);

  const categorias = Object.keys(grupos).sort((a, b) => {
    const ordenA = ordenMap.get(a);
    const ordenB = ordenMap.get(b);

    if (ordenA !== undefined && ordenB !== undefined) return ordenA - ordenB;
    if (ordenA !== undefined) return -1;
    if (ordenB !== undefined) return 1;

    const indexA = FALLBACK_ORDEN.indexOf(a);
    const indexB = FALLBACK_ORDEN.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b, 'es');
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return categorias.map((categoria) => ({
    categoria,
    items: grupos[categoria],
  }));
}
