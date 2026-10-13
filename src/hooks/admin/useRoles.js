import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as rolesService from '../../services/admin/rolesService.js';

export const rolesKeys = {
  all: ['roles'],
  list: () => [...rolesKeys.all, 'list'],
  detail: (id) => [...rolesKeys.all, 'detail', id],
};

export function useRoles() {
  return useQuery({
    queryKey: rolesKeys.list(),
    queryFn: rolesService.listarRoles,
  });
}

export function useRol(id) {
  return useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: () => rolesService.obtenerRol(id),
    enabled: Boolean(id),
  });
}

export function useCrearRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesService.crearRol,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rolesKeys.all }),
  });
}

export function useActualizarRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => rolesService.actualizarRol(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(id) });
    },
  });
}

export function useEliminarRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesService.eliminarRol,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rolesKeys.all }),
  });
}

export function useSincronizarPermisosRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permisoIds }) => rolesService.sincronizarPermisosRol(id, permisoIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(id) });
    },
  });
}
