import { useCallback, useRef } from 'react';

/**
 * Efecto tilt 3D suave al mover el mouse sobre un elemento.
 * Usa CSS variables --tilt-x y --tilt-y.
 */
export function useTilt3D(intensity = 10) {
  const ref = useRef(null);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      el.style.setProperty('--tilt-x', `${-y * intensity}deg`);
      el.style.setProperty('--tilt-y', `${x * intensity}deg`);
    },
    [intensity],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  }, []);

  return { ref, onMove, onLeave };
}
