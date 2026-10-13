import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSiteContenido } from '../../providers/SiteContenidoProvider.jsx';
import { useProductos } from '../../hooks/useProductos.js';
import { useCategorias } from '../../hooks/useCategorias.js';
import { agruparPorCategoria } from '../../utils/agruparProductos.js';
import { Alert } from '../ui/Alert.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { LoUltimoStrip } from './LoUltimoStrip.jsx';
import { ProductoCard } from './ProductoCard.jsx';
import {
  ProductosCatalogoFiltro,
  PRODUCTOS_FILTRO_TODAS,
  filtrarGruposProductos,
} from './ProductosCatalogoFiltro.jsx';

const BUSQUEDA_SCROLL_DELAY_MS = 650;

function getScrollOffset() {
  const root = document.documentElement;
  const headerHeight = parseFloat(getComputedStyle(root).getPropertyValue('--header-height')) || 112;
  return headerHeight + 72;
}

export function ProductosSection() {
  const { site } = useSiteContenido();
  const { productos: textos } = site;
  const { data: productos, isLoading, isError, error } = useProductos();
  const { data: categorias } = useCategorias();
  const grupos = agruparPorCategoria(productos, categorias);
  const [categoriaActiva, setCategoriaActiva] = useState(PRODUCTOS_FILTRO_TODAS);
  const [busqueda, setBusqueda] = useState('');
  const [scrollRequest, setScrollRequest] = useState(0);
  const resultadosRef = useRef(null);
  const pendingScrollRef = useRef(false);
  const busquedaTimerRef = useRef(null);

  const categoriasNombres = useMemo(
    () => grupos.map((grupo) => grupo.categoria),
    [grupos],
  );

  const gruposFiltrados = useMemo(
    () =>
      filtrarGruposProductos(grupos, {
        categoriaActiva,
        busqueda,
        todasKey: PRODUCTOS_FILTRO_TODAS,
      }),
    [grupos, categoriaActiva, busqueda],
  );

  const hayFiltroActivo =
    categoriaActiva !== PRODUCTOS_FILTRO_TODAS || busqueda.trim().length > 0;

  const scrollToResultados = useCallback(() => {
    const node = resultadosRef.current;
    if (!node) return;

    const top = node.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, []);

  const handleCategoriaChange = useCallback((categoria) => {
    setCategoriaActiva(categoria);
    pendingScrollRef.current = true;
  }, []);

  const handleBusquedaChange = useCallback((valor) => {
    setBusqueda(valor);
    if (busquedaTimerRef.current) clearTimeout(busquedaTimerRef.current);
    if (!valor.trim()) return;

    busquedaTimerRef.current = setTimeout(() => {
      pendingScrollRef.current = true;
      setScrollRequest((prev) => prev + 1);
    }, BUSQUEDA_SCROLL_DELAY_MS);
  }, []);

  useEffect(() => {
    if (!pendingScrollRef.current) return undefined;
    pendingScrollRef.current = false;
    const frame = requestAnimationFrame(scrollToResultados);
    return () => cancelAnimationFrame(frame);
  }, [gruposFiltrados, scrollRequest, scrollToResultados]);

  useEffect(
    () => () => {
      if (busquedaTimerRef.current) clearTimeout(busquedaTimerRef.current);
    },
    [],
  );

  return (
    <section id="productos" className="productos section sectionAlt">
      <div className="container">
        <Reveal>
          <div className="sectionHeader">
            <span className="sectionEyebrow">Productos</span>
            <h2 className="sectionTitle">{textos.titulo}</h2>
            <p className="sectionSubtitle">{textos.subtitulo}</p>
          </div>
        </Reveal>

        {!isError && <LoUltimoStrip />}

        {isError && (
          <Alert variant="error">
            {error?.message || 'No se pudieron cargar los productos. Intentá de nuevo más tarde.'}
          </Alert>
        )}

        {isLoading && (
          <div className="estado estadoLoading">
            <div className="spinner" aria-hidden="true" />
            <p>Cargando catálogo...</p>
          </div>
        )}

        {!isLoading && !isError && productos?.length === 0 && (
          <div className="estado estadoVacio">
            <p>{textos.vacio}</p>
          </div>
        )}

        {!isLoading && !isError && grupos.length > 0 && (
          <div className="productosCategorias">
            <Reveal>
              <div className="productosCatalogoHeader">
                <span className="productosCatalogoEyebrow">Catálogo</span>
                <h3 className="productosCatalogoTitulo">Por categoría</h3>
              </div>
            </Reveal>

            <div className="productosFiltroSticky">
              <ProductosCatalogoFiltro
                categorias={categoriasNombres}
                categoriaActiva={categoriaActiva}
                busqueda={busqueda}
                onCategoriaChange={handleCategoriaChange}
                onBusquedaChange={handleBusquedaChange}
              />
            </div>

            <div id="productos-resultados" ref={resultadosRef} className="productosResultados">
              {gruposFiltrados.length === 0 && hayFiltroActivo && (
                <div className="estado estadoVacio productosFiltroVacio">
                  <p>No encontramos productos con ese filtro.</p>
                  <button
                    type="button"
                    className="productosFiltroLimpiar"
                    onClick={() => {
                      setCategoriaActiva(PRODUCTOS_FILTRO_TODAS);
                      setBusqueda('');
                      pendingScrollRef.current = true;
                    }}
                  >
                    Ver todo el catálogo
                  </button>
                </div>
              )}

              {gruposFiltrados.map((grupo, grupoIndex) => (
                <Reveal key={grupo.categoria} delay={grupoIndex * 60}>
                  <div className="productosGrupo" id={`productos-grupo-${grupo.categoria.replace(/\s+/g, '-').toLowerCase()}`}>
                    <div className="productosGrupoHeader">
                      <h3 className="productosGrupoTitulo">{grupo.categoria}</h3>
                      <span className="productosGrupoCount">{grupo.items.length}</span>
                    </div>
                    <div className="productosGrid">
                      {grupo.items.map((producto, index) => (
                        <ProductoCard
                          key={producto.id}
                          producto={producto}
                          style={{ '--stagger': `${index * 50}ms` }}
                          showDestacadoBadge={producto.esDestacado}
                        />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
