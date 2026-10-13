import { getAccessToken } from './api.js';

const API_URL = import.meta.env.VITE_API_URL;

export async function subirArchivoMedia(file, { clave, carpeta, modulo, previousUrl } = {}) {
  const formData = new FormData();
  formData.append('file', file);
  if (clave) formData.append('clave', clave);
  if (carpeta) formData.append('carpeta', carpeta);
  if (modulo) formData.append('modulo', modulo);
  if (previousUrl) formData.append('previousUrl', previousUrl);

  const token = getAccessToken();
  const res = await fetch(`${API_URL}/api/admin/media/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || body.error || 'Error al subir archivo');
    error.status = res.status;
    throw error;
  }

  return body.data;
}
