import { useSiteContenido } from '../../providers/SiteContenidoProvider.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { HistoriaSlider } from './HistoriaSlider.jsx';

export function HistoriaSection() {
  const { site } = useSiteContenido();
  const { historia } = site;

  return (
    <section id="historia" className="historia section">
      <div className="container">
        <Reveal>
          <div className="sectionHeader">
            <span className="sectionEyebrow">Desde 1993</span>
            <h2 className="sectionTitle">{historia.titulo}</h2>
            <p className="sectionSubtitle">{historia.subtitulo}</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <HistoriaSlider />
        </Reveal>
      </div>
    </section>
  );
}
