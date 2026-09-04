const CATEGORIA_ORDEN = [
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

export function agruparPorCategoria(productos) {
  if (!productos?.length) return [];

  const grupos = productos.reduce((acc, producto) => {
    const categoria = producto.categoria || 'Otros';
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(producto);
    return acc;
  }, {});

  const categorias = Object.keys(grupos).sort((a, b) => {
    const indexA = CATEGORIA_ORDEN.indexOf(a);
    const indexB = CATEGORIA_ORDEN.indexOf(b);
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
