import { useSiteContenido } from '../../providers/SiteContenidoProvider.jsx';
import { useDestacados } from '../../hooks/useDestacados.js';
import { Reveal } from '../ui/Reveal.jsx';
import { ProductoCard } from './ProductoCard.jsx';

export function LoUltimoStrip() {
  const { site } = useSiteContenido();
  const textos = site.loUltimo ?? {};
  const { data: novedades = [], isLoading } = useDestacados('lo_ultimo');

  if (isLoading) {
    return (
      <div className="loUltimo loUltimoLoading">
        <p>Cargando novedades…</p>
      </div>
    );
  }

  if (!novedades.length) {
    return null;
  }

  return (
    <div className="loUltimo">
      <Reveal>
        <div className="loUltimoHeader">
          <div className="loUltimoHeaderMain">
            <span className="loUltimoEyebrow">Novedades</span>
            <h3 className="loUltimoTitulo">{textos.titulo || 'Lo último'}</h3>
          </div>
          <p className="loUltimoSubtitulo">
            {textos.subtitulo ||
              'Nuestros lanzamientos más recientes, elaborados con la misma frescura de siempre.'}
          </p>
        </div>
      </Reveal>

      <div className="loUltimoGrid">
        {novedades.map((producto, index) => (
          <Reveal key={producto.id} delay={index * 80}>
            <ProductoCard
              producto={producto}
              variant="nuevo"
              style={{ '--stagger': `${index * 60}ms` }}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
