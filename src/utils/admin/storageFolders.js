const BRANDING_KEYS = new Set(['logo', 'logo-blanco', 'favicon']);
const BRANDING_PREFIXES = ['video-', 'hero-', 'historia-'];

/** Espejo de backend/src/utils/storagePaths.js para hints en admin. */
export function inferirCarpetaStorage(clave) {
  const key = String(clave || '').trim().toLowerCase();
  if (!key) return 'media';

  if (BRANDING_KEYS.has(key)) return 'branding';
  if (BRANDING_PREFIXES.some((prefix) => key.startsWith(prefix))) return 'branding';
  if (key.startsWith('producto-') || key.startsWith('productos-')) return 'productos';
  if (key.startsWith('categoria-') || key.startsWith('categorias-')) return 'categorias';

  return 'media';
}

export const CARPETAS_STORAGE = [
  { value: '', label: 'Automática (según clave)' },
  { value: 'branding', label: 'branding — logos, videos, favicon' },
  { value: 'productos', label: 'productos — imágenes de catálogo' },
  { value: 'categorias', label: 'categorias — imágenes de categorías' },
  { value: 'media', label: 'media — assets genéricos' },
];
