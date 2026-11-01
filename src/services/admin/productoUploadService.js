import { getAccessToken } from './api.js';
import { asociarMensajeApi } from '../../utils/apiMessage.js';

const API_URL = import.meta.env.VITE_API_URL;

export async function subirImagenProducto(file, { productoId, previousUrl } = {}) {
  const formData = new FormData();
  formData.append('file', file);
  if (productoId) formData.append('productoId', productoId);
  if (previousUrl) formData.append('previousUrl', previousUrl);

  const token = getAccessToken();
  const res = await fetch(`${API_URL}/api/admin/productos/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || body.error || 'Error al subir imagen');
    error.status = res.status;
    throw error;
  }

  return asociarMensajeApi(body.data, body.message);
}
