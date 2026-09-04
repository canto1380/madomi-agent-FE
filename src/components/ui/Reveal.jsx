import { useReveal } from '../../hooks/useReveal.js';

const REVEAL_VARIANTS = {
  up: 'revealUp',
  left: 'revealLeft',
  right: 'revealRight',
  scale: 'revealScale',
};

export function Reveal({ children, className = '', delay = 0, variant = 'up' }) {
  const [ref, visible] = useReveal();

  const variantClass = REVEAL_VARIANTS[variant] ?? REVEAL_VARIANTS.up;

  return (
    <div
      ref={ref}
      className={`reveal ${variantClass} ${visible ? 'revealVisible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}
