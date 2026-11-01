import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAccessToken, clearTokens } from '../services/authApi.js';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarSesion = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUsuario(null);
      setCargando(false);
      return;
    }

    try {
      const data = await authService.fetchMe();
      setUsuario(data);
    } catch {
      try {
        const refreshed = await authService.refreshSession();
        if (refreshed?.usuario) {
          setUsuario(refreshed.usuario);
          return;
        }
      } catch {
        // sin sesión válida
      }
      clearTokens();
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarSesion();
  }, [cargarSesion]);

  const login = useCallback(async (credenciales) => {
    const data = await authService.login(credenciales);
    setUsuario(data.usuario);
    return data;
  }, []);

  const register = useCallback(async (datos) => {
    const data = await authService.register(datos);
    setUsuario(data.usuario);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const data = await authService.logout();
    setUsuario(null);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      autenticado: Boolean(usuario),
      login,
      register,
      logout,
      recargarSesion: cargarSesion,
    }),
    [usuario, cargando, login, register, logout, cargarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
