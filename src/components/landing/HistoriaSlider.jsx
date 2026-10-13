import { useCallback, useRef, useState } from 'react';
import { useSiteContenido } from '../../providers/SiteContenidoProvider.jsx';
import { HistoriaMetric } from './HistoriaMetric.jsx';
import { HistoriaVideo } from './HistoriaVideo.jsx';

const SLIDES = [
  {
    id: 'tradicion',
    titulo: 'Una tradición de excelencia',
    parrafoIndex: 0,
    metricEtiquetas: ['Productos', 'Familias confían en nosotros'],
  },
  {
    id: 'innovacion',
    titulo: 'Innovación y calidad',
    parrafoIndex: 1,
    metricEtiquetas: ['Años de experiencia', 'Clientes y Distribuidores'],
  },
];

const SWIPE_THRESHOLD = 48;

function resolveStats(stats, etiquetas) {
  return etiquetas
    .map((etiqueta) => stats.find((stat) => stat.etiqueta === etiqueta))
    .filter(Boolean);
}

export function HistoriaSlider() {
  const { site } = useSiteContenido();
  const { historia } = site;
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const carouselRef = useRef(null);
  const total = SLIDES.length;
  const activeSlide = SLIDES[activeIndex];
  const slideOffsetPercent = (100 / total) * activeIndex;

  const goTo = useCallback(
    (index) => {
      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const onCarouselKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        goTo(total - 1);
      }
    },
    [goPrev, goNext, goTo, total],
  );

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const deltaX = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current);
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (deltaX > 0) goNext();
    else goPrev();
  };

  return (
    <div
      ref={carouselRef}
      className="historiaSlider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Historia de Madomi"
      tabIndex={0}
      onKeyDown={onCarouselKeyDown}
    >
      <p className="visuallyHidden" aria-live="polite" aria-atomic="true">
        {activeSlide.titulo} — slide {activeIndex + 1} de {total}
      </p>

      <div className="historiaSliderLayout">
        <div className="historiaSliderContent">
          <div className="historiaSliderControls">
            <button
              type="button"
              className="historiaSliderArrow"
              onClick={goPrev}
              aria-label="Slide anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="historiaSliderArrow"
              onClick={goNext}
              aria-label="Slide siguiente"
            >
              ›
            </button>
          </div>

          <div
            className="historiaSliderViewport"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="historiaSliderTrack"
              style={{
                '--slide-count': total,
                transform: `translateX(-${slideOffsetPercent}%)`,
              }}
              aria-live="off"
            >
              {SLIDES.map((slide, index) => {
                const metrics = resolveStats(historia.stats, slide.metricEtiquetas);
                const isActive = index === activeIndex;

                return (
                  <article
                    key={slide.id}
                    id={`historia-slide-${slide.id}`}
                    className="historiaSlide"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} de ${total}`}
                    aria-hidden={!isActive}
                  >
                    <h3 id={`historia-slide-title-${slide.id}`} className="historiaSlideTitulo">
                      {slide.titulo}
                    </h3>

                    <div className="historiaStats">
                      {metrics.map((stat) => (
                        <HistoriaMetric
                          key={`${slide.id}-${stat.etiqueta}`}
                          valor={stat.valor}
                          etiqueta={stat.etiqueta}
                          animate={isActive}
                        />
                      ))}
                    </div>

                    <p className="historiaSlideTexto">{historia.parrafos[slide.parrafoIndex]}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="historiaSliderDots" aria-label="Ir a un slide">
            {SLIDES.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  className={`historiaSliderDot ${isActive ? 'historiaSliderDotActive' : ''}`}
                  aria-label={`${slide.titulo} (${index + 1} de ${total})`}
                  aria-controls={`historia-slide-${slide.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => goTo(index)}
                />
              );
            })}
          </div>
        </div>

        <div className="historiaSliderMedia">
          <HistoriaVideo />
        </div>
      </div>
    </div>
  );
}
