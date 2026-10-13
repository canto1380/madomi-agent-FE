import { APP_CONSTANTS } from '../constants/constants.js';

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeDeep(base, patch) {
  if (!isPlainObject(patch)) return patch ?? base;

  const result = { ...base };
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (isPlainObject(value) && isPlainObject(base[key])) {
      result[key] = mergeDeep(base[key], value);
      return;
    }
    if (Array.isArray(value) && value.length === 0) return;
    result[key] = value;
  });
  return result;
}

export function buildSiteContenido({ brandingApi, contactoApi, mediaApi, redesApi }) {
  const merged = mergeDeep(APP_CONSTANTS, brandingApi ?? {});

  if (contactoApi) {
    merged.contacto = mergeDeep(APP_CONSTANTS.contacto, contactoApi);
  }

  const mediaByClave = (mediaApi ?? []).reduce((acc, item) => {
    acc[item.clave] = item;
    return acc;
  }, {});

  if (mediaByClave.logo?.url) {
    merged.branding = {
      ...merged.branding,
      logoUrl: mediaByClave.logo.url,
      logoAlt: mediaByClave.logo.alt || merged.branding.logoAlt,
    };
  }

  return {
    ...merged,
    mediaByClave,
    redes: redesApi ?? [],
  };
}

export function getMediaUrl(site, clave, fallback = '') {
  return site?.mediaByClave?.[clave]?.url || fallback;
}
