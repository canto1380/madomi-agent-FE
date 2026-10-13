import apiRequest, { setTokens, clearTokens, getRefreshToken } from './authApi.js';

export async function register(payload) {
  const data = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setTokens(data);
  return data;
}

export async function login(payload) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setTokens(data);
  return data;
}

export async function logout() {
  const refreshToken = getRefreshToken();
  try {
    await apiRequest(
      '/api/auth/logout',
      {
        method: 'POST',
        body: JSON.stringify(refreshToken ? { refreshToken } : {}),
      },
      { skipAuthRetry: true },
    );
  } finally {
    clearTokens();
  }
}

export async function fetchMe() {
  return apiRequest('/api/auth/me');
}

export async function refreshSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const data = await apiRequest(
    '/api/auth/refresh',
    {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    },
    { skipAuthRetry: true },
  );
  setTokens(data);
  return data;
}
