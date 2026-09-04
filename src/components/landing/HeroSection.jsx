import { lazy, Suspense } from 'react';
import { APP_CONSTANTS } from '../../constants/constants.js';
import { Button } from '../ui/Button.jsx';
import { Reveal } from '../ui/Reveal.jsx';

const HeroScene3D = lazy(() =>
  import('./HeroScene3D.jsx').then((module) => ({ default: module.HeroScene3D })),
);

function HeroCanvasFallback() {
  return <div className="heroCanvasFallback" aria-hidden="true" />;
}

export function HeroSection() {
  const { hero, contacto } = APP_CONSTANTS;

  return (
    <section id="inicio" className="hero">
      <Suspense fallback={<HeroCanvasFallback />}>
        <HeroScene3D />
      </Suspense>

      <div className="heroOverlay" aria-hidden="true" />
      <div className="heroGrain" aria-hidden="true" />

      <div className="container heroLayout heroLayoutSingle">
        <div className="heroContent">
          <Reveal delay={0}>
            <span className="heroBadge">{APP_CONSTANTS.tagline}</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="heroTitle">{hero.titulo}</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="heroSubtitle">{hero.subtitulo}</p>
          </Reveal>
          <Reveal delay={220}>
            <div className="heroHighlights">
              <span>+30 años</span>
              <span>Pasteurización NOA</span>
              <span>6 provincias</span>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <div className="heroActions">
              <Button href="#productos" variant="primary" className="btnGlow">
                {hero.ctaProductos}
              </Button>
              {/* <Button href="#contacto" variant="outline">
                {hero.ctaContacto}
              </Button> */}
              <a href={contacto.whatsapp} className="heroWhatsapp" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <a href="#historia" className="heroScroll" aria-label="Ir a la sección Historia">
        <span className="heroScrollLine" />
      </a>
    </section>
  );
}
