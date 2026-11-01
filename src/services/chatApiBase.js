/**
 * Base URL del backend. En dev, si VITE_API_URL está vacía, usamos rutas relativas (/api)
 * y el proxy de Vite (vite.config.js → localhost:4000).
 */
export function resolverChatApiBase() {
  const raw = import.meta.env.VITE_API_URL?.trim?.() ?? '';
  if (!raw) {
    return '';
  }
  if (raw === 'undefined' || raw === 'null') {
    return '';
  }
  return raw.replace(/\/$/, '');
}

export function urlApiChat(path) {
  const base = resolverChatApiBase();
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

export function resolverChatStreamTimeoutMs() {
  const n = Number(import.meta.env.VITE_CHAT_STREAM_TIMEOUT_MS);
  if (Number.isFinite(n) && n >= 10_000) {
    return n;
  }
  return 120_000;
}
