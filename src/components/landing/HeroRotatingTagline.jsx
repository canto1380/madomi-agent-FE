import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

const ROTATE_MS = 4200;

export function HeroRotatingTagline({ lines }) {
  const reducedMotion = usePrefersReducedMotion();
  const safeLines = lines.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || safeLines.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeLines.length);
    }, ROTATE_MS);

    return () => clearInterval(timer);
  }, [reducedMotion, safeLines.length]);

  if (safeLines.length === 0) return null;

  return (
    <span className="heroBadge heroBadgeRotating" aria-live="polite">
      {safeLines.map((line, index) => (
        <span
          key={line}
          className={`heroBadgeLine ${index === activeIndex ? 'heroBadgeLineActive' : ''}`}
          aria-hidden={index !== activeIndex}
        >
          {line}
        </span>
      ))}
    </span>
  );
}
