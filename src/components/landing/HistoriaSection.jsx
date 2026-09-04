import { APP_CONSTANTS } from '../../constants/constants.js';
import { Reveal } from '../ui/Reveal.jsx';
import { HistoriaSlider } from './HistoriaSlider.jsx';

export function HistoriaSection() {
  const { historia } = APP_CONSTANTS;

  return (
    <section id="historia" className="historia section">
      <div className="container">
        <Reveal>
          <div className="sectionHeader">
            <span className="sectionEyebrow">Desde 1993</span>
            <h2 className="sectionTitle">{historia.titulo}</h2>
            <p className="sectionSubtitle">
              Descubrí la trayectoria que nos llevó a ser la pasta de todos los tucumanos.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <HistoriaSlider />
        </Reveal>
      </div>
    </section>
  );
}
