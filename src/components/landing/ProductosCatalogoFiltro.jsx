const TODAS = '__todas__';

export function ProductosCatalogoFiltro({
  categorias,
  categoriaActiva,
  busqueda,
  onCategoriaChange,
  onBusquedaChange,
}) {
  return (
    <div className="productosFiltro">
      <label className="productosFiltroBusqueda">
        <span className="visuallyHidden">Buscar producto</span>
        <input
          type="search"
          className="productosFiltroInput"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(event) => onBusquedaChange(event.target.value)}
          autoComplete="off"
        />
      </label>

      <div className="productosFiltroCategorias" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          className={`productosFiltroChip ${categoriaActiva === TODAS ? 'productosFiltroChipActive' : ''}`}
          aria-pressed={categoriaActiva === TODAS}
          onClick={() => onCategoriaChange(TODAS)}
        >
          Todas
        </button>
        {categorias.map((nombre) => (
          <button
            key={nombre}
            type="button"
            className={`productosFiltroChip ${categoriaActiva === nombre ? 'productosFiltroChipActive' : ''}`}
            aria-pressed={categoriaActiva === nombre}
            onClick={() => onCategoriaChange(nombre)}
          >
            {nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export { TODAS as PRODUCTOS_FILTRO_TODAS };

export function filtrarGruposProductos(grupos, { categoriaActiva, busqueda, todasKey = TODAS }) {
  let result = grupos;

  if (categoriaActiva && categoriaActiva !== todasKey) {
    result = result.filter((grupo) => grupo.categoria === categoriaActiva);
  }

  const termino = busqueda.trim().toLowerCase();
  if (!termino) return result;

  return result
    .map((grupo) => ({
      ...grupo,
      items: grupo.items.filter((producto) => {
        const nombre = producto.nombre?.toLowerCase() ?? '';
        const descripcion = producto.descripcion?.toLowerCase() ?? '';
        return nombre.includes(termino) || descripcion.includes(termino);
      }),
    }))
    .filter((grupo) => grupo.items.length > 0);
}
