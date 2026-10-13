const API_URL = import.meta.env.VITE_API_URL;

async function fetchPublic(path) {
  const res = await fetch(`${API_URL}${path}`);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.message || body.error || 'Error al cargar contenido');
  }

  return body.data;
}

export const obtenerBranding = () => fetchPublic('/api/branding');
export const obtenerContacto = () => fetchPublic('/api/contacto');
export const obtenerMedia = () => fetchPublic('/api/media');
export const obtenerRedes = () => fetchPublic('/api/redes');
