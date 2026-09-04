import { useEffect, useRef, useState } from 'react';

/**
 * Anima un número desde 0 hasta target cuando entra en viewport.
 */
export function useCountUp(target, { duration = 2000, enabled = true } = {}) {
  const ref = useRef(null);
  const [count, setCount] = useState(enabled ? 0 : target);
  const [started, setStarted] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setCount(target);
      setStarted(true);
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, target]);

  useEffect(() => {
    if (!started || !enabled) return undefined;

    let frameId;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [started, target, duration, enabled]);

  return { ref, count };
}

/**
 * Parsea valores como "30+", "15.000+" para animación.
 */
export function parseStatValor(valor) {
  const match = String(valor).match(/^([\d.]+)(.*)$/);
  if (!match) {
    return { target: 0, suffix: valor, useLocale: false };
  }

  const raw = match[1];
  const suffix = match[2] ?? '';
  const useLocale = raw.includes('.');
  const target = parseInt(raw.replace(/\./g, ''), 10);

  return { target: Number.isNaN(target) ? 0 : target, suffix, useLocale };
}

export function formatStatCount(count, useLocale) {
  if (useLocale) {
    return count.toLocaleString('es-AR');
  }
  return String(count);
}

/** Texto final de una métrica (ej. "30+", "15.000+") para reservar espacio en layout. */
export function formatStatValor(valor) {
  const { target, suffix, useLocale } = parseStatValor(valor);
  return `${formatStatCount(target, useLocale)}${suffix}`;
}
