const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
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
    error.code = body.error;
    throw error;
  }

  return body.data;
}

export default apiRequest;
