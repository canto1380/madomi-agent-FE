import { useCallback, useEffect, useState } from 'react';
import { APP_CONSTANTS } from '../../constants/constants.js';
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

function resolveStats(stats, etiquetas) {
  return etiquetas
    .map((etiqueta) => stats.find((stat) => stat.etiqueta === etiqueta))
    .filter(Boolean);
}

export function HistoriaSlider() {
  const { historia } = APP_CONSTANTS;
  const [activeIndex, setActiveIndex] = useState(0);
  const total = SLIDES.length;

  const goTo = useCallback(
    (index) => {
      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goPrev, goNext]);

  return (
    <div className="historiaSlider" aria-roledescription="carousel">
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

          <div className="historiaSliderViewport">
            <div
              className="historiaSliderTrack"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {SLIDES.map((slide, index) => {
                const metrics = resolveStats(historia.stats, slide.metricEtiquetas);

                return (
                  <article
                    key={slide.id}
                    className="historiaSlide"
                    aria-hidden={index !== activeIndex}
                    aria-labelledby={`historia-slide-title-${slide.id}`}
                  >
                    <h3 id={`historia-slide-title-${slide.id}`} className="historiaSlideTitulo">
                      {slide.titulo}
                    </h3>
                    <p className="historiaSlideTexto">{historia.parrafos[slide.parrafoIndex]}</p>

                    <div className="historiaStats">
                      {index === activeIndex &&
                        metrics.map((stat) => (
                          <HistoriaMetric
                            key={`${slide.id}-${stat.etiqueta}`}
                            valor={stat.valor}
                            etiqueta={stat.etiqueta}
                          />
                        ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="historiaSliderDots" role="tablist" aria-label="Slides de historia">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                className={`historiaSliderDot ${index === activeIndex ? 'historiaSliderDotActive' : ''}`}
                aria-selected={index === activeIndex}
                aria-label={`${slide.titulo} (${index + 1} de ${total})`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>

        <div className="historiaSliderMedia">
          <HistoriaVideo />
        </div>
      </div>
    </div>
  );
}
