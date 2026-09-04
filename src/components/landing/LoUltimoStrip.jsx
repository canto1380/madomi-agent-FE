import { LO_ULTIMO } from '../../constants/loUltimo.js';
import { resolverLoUltimo } from '../../utils/resolverLoUltimo.js';
import { Reveal } from '../ui/Reveal.jsx';
import { ProductoCard } from './ProductoCard.jsx';

export function LoUltimoStrip({ productos }) {
  const destacados = resolverLoUltimo(productos);

  return (
    <div className="loUltimo">
      <Reveal>
        <div className="loUltimoHeader">
          <div className="loUltimoHeaderMain">
            <span className="loUltimoEyebrow">Novedades</span>
            <h3 className="loUltimoTitulo">{LO_ULTIMO.titulo}</h3>
          </div>
          <p className="loUltimoSubtitulo">{LO_ULTIMO.subtitulo}</p>
        </div>
      </Reveal>

      <div className="loUltimoGrid">
        {destacados.map((producto, index) => (
          <Reveal key={producto.id} delay={index * 80}>
            <ProductoCard producto={producto} variant="destacado" style={{ '--stagger': `${index * 60}ms` }} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
