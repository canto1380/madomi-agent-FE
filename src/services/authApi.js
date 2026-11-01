import { asociarMensajeApi } from '../utils/apiMessage.js';

const API_URL = import.meta.env.VITE_API_URL;

const STORAGE_ACCESS = 'accessToken';
const STORAGE_REFRESH = 'refreshToken';

export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_ACCESS);
};

export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_REFRESH);
};

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(STORAGE_ACCESS, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_REFRESH, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_ACCESS);
  localStorage.removeItem(STORAGE_REFRESH);
};

let refreshPromise = null;

async function intentarRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          clearTokens();
          return null;
        }
        setTokens(body.data);
        return body.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiRequest(path, options = {}, { retry = true, skipAuthRetry = false } = {}) {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && retry && !skipAuthRetry && getRefreshToken()) {
    const nuevoToken = await intentarRefresh();
    if (nuevoToken) {
      return apiRequest(path, options, { retry: false });
    }
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || body.error || 'Error de servidor');
    error.status = res.status;
    error.code = body.error;
    throw error;
  }

  return asociarMensajeApi(body.data, body.message);
}

export default apiRequest;
