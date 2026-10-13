import { useMemo } from 'react';
import { useAuth } from './useAuth.js';
import { usuarioTieneAlgunPermiso, usuarioTienePermiso } from '../constants/permisosAdmin.js';

export function usePermisosUsuario() {
  const { usuario } = useAuth();

  return useMemo(
    () => ({
      permisosCodigos: usuario?.permisosCodigos ?? [],
      puede: (codigo) => usuarioTienePermiso(usuario, codigo),
      puedeAlguno: (codigos) => usuarioTieneAlgunPermiso(usuario, codigos),
    }),
    [usuario],
  );
}
