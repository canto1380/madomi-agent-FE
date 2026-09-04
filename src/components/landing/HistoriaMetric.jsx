import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import {
  formatStatCount,
  formatStatValor,
  parseStatValor,
  useCountUp,
} from '../../hooks/useCountUp.js';

/**
 * Métrica animada de la sección Historia.
 * Nombre evita "StatCounter" — los ad blockers lo bloquean (servicio de analytics homónimo).
 */
export function HistoriaMetric({ valor, etiqueta, animate = true }) {
  const reducedMotion = usePrefersReducedMotion();
  const { target, suffix, useLocale } = parseStatValor(valor);
  const shouldAnimate = animate && !reducedMotion;
  const { ref, count } = useCountUp(target, { enabled: shouldAnimate, duration: 2200 });
  const displayValue = shouldAnimate
    ? `${formatStatCount(count, useLocale)}${suffix}`
    : formatStatValor(valor);
  const measureValue = formatStatValor(valor);

  return (
    <div ref={ref} className="historiaStat">
      <span className="historiaStatValor" aria-label={`${valor} ${etiqueta}`}>
        <span className="historiaStatValorMeasure" aria-hidden="true">
          {measureValue}
        </span>
        <span className="historiaStatValorDisplay">{displayValue}</span>
      </span>
      <span className="historiaStatEtiqueta">{etiqueta}</span>
    </div>
  );
}
