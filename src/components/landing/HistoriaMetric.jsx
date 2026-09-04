import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { formatStatCount, parseStatValor, useCountUp } from '../../hooks/useCountUp.js';

/**
 * Métrica animada de la sección Historia.
 * Nombre evita "StatCounter" — los ad blockers lo bloquean (servicio de analytics homónimo).
 */
export function HistoriaMetric({ valor, etiqueta }) {
  const reducedMotion = usePrefersReducedMotion();
  const { target, suffix, useLocale } = parseStatValor(valor);
  const { ref, count } = useCountUp(target, { enabled: !reducedMotion, duration: 2200 });

  return (
    <div ref={ref} className="historiaStat">
      <span className="historiaStatValor" aria-label={`${valor} ${etiqueta}`}>
        {formatStatCount(count, useLocale)}
        {suffix}
      </span>
      <span className="historiaStatEtiqueta">{etiqueta}</span>
    </div>
  );
}
