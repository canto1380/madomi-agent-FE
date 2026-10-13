import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as redesAdminService from '../../services/admin/redesAdminService.js';

export const redesAdminKeys = {
  all: ['admin', 'redes'],
  list: (params) => [...redesAdminKeys.all, 'list', params],
  detail: (id) => [...redesAdminKeys.all, 'detail', id],
};

export function useRedesAdmin(params = {}) {
  return useQuery({
    queryKey: redesAdminKeys.list(params),
    queryFn: () => redesAdminService.listarRedes(params),
  });
}

export function useRedAdmin(id) {
  return useQuery({
    queryKey: redesAdminKeys.detail(id),
    queryFn: () => redesAdminService.obtenerRed(id),
    enabled: Boolean(id),
  });
}

export function useCrearRedAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: redesAdminService.crearRed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: redesAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['redes'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'redes'] });
    },
  });
}

export function useActualizarRedAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => redesAdminService.actualizarRed(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: redesAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: redesAdminKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['redes'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'redes'] });
    },
  });
}

export function useDesactivarRedAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: redesAdminService.desactivarRed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: redesAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['redes'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'redes'] });
    },
  });
}

export function useReactivarRedAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => redesAdminService.actualizarRed(id, { activo: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: redesAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['redes'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'redes'] });
    },
  });
}
