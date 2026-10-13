import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as usuariosService from '../../services/admin/usuariosService.js';

export const usuariosKeys = {
  all: ['usuarios'],
  list: (params) => [...usuariosKeys.all, 'list', params],
  detail: (id) => [...usuariosKeys.all, 'detail', id],
};

export function useUsuarios(params = {}) {
  return useQuery({
    queryKey: usuariosKeys.list(params),
    queryFn: () => usuariosService.listarUsuarios(params),
  });
}

export function useUsuario(id) {
  return useQuery({
    queryKey: usuariosKeys.detail(id),
    queryFn: () => usuariosService.obtenerUsuario(id),
    enabled: Boolean(id),
  });
}

export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usuariosService.crearUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usuariosKeys.all }),
  });
}

export function useActualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => usuariosService.actualizarUsuario(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.all });
      queryClient.invalidateQueries({ queryKey: usuariosKeys.detail(id) });
    },
  });
}

export function useEliminarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usuariosService.eliminarUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usuariosKeys.all }),
  });
}

export function useReactivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usuariosService.reactivarUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usuariosKeys.all }),
  });
}
