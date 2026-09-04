import { APP_CONSTANTS } from '../../constants/constants.js';

const LOGO_VARIANTS = {
  header: 'logoHeader',
  footer: 'logoFooter',
};

/**
 * Logo con proporción original (horizontal ~2:1).
 * Evita estiramiento forzando object-fit: contain.
 */
export function Logo({ className = '', variant = 'header' }) {
  const { branding } = APP_CONSTANTS;
  const variantClass = LOGO_VARIANTS[variant] ?? LOGO_VARIANTS.header;

  return (
    <img
      src={branding.logoUrl}
      alt={branding.logoAlt}
      className={`logo ${variantClass} ${className}`.trim()}
      width={200}
      height={100}
      decoding="async"
    />
  );
}
