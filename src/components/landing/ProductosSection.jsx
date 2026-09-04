import { APP_CONSTANTS } from '../../constants/constants.js';
import { useProductos } from '../../hooks/useProductos.js';
import { agruparPorCategoria } from '../../utils/agruparProductos.js';
import { Alert } from '../ui/Alert.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { LoUltimoStrip } from './LoUltimoStrip.jsx';
import { ProductoCard } from './ProductoCard.jsx';

export function ProductosSection() {
  const { productos: textos } = APP_CONSTANTS;
  const { data: productos, isLoading, isError, error } = useProductos();
  const grupos = agruparPorCategoria(productos);

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

        {!isError && <LoUltimoStrip productos={productos} />}

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

            {grupos.map((grupo, grupoIndex) => (
              <Reveal key={grupo.categoria} delay={grupoIndex * 60}>
                <div className="productosGrupo">
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
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
