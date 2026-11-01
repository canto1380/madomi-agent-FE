import { urlApiChat } from './chatApiBase.js';

export async function apiRequest(path, options = {}) {
  const res = await fetch(urlApiChat(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || body.error || 'Error de servidor');
    error.status = res.status;
    error.code = body.error ?? body.code;
    throw error;
  }

  return body.data;
}

export default apiRequest;
