import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contenidoAdminService from '../../services/admin/contenidoAdminService.js';

export const contenidoAdminKeys = {
  all: ['admin', 'contenido'],
  list: (params) => [...contenidoAdminKeys.all, 'list', params],
  detail: (id) => [...contenidoAdminKeys.all, 'detail', id],
};

export function useContenidoAdmin(params = {}) {
  return useQuery({
    queryKey: contenidoAdminKeys.list(params),
    queryFn: () => contenidoAdminService.listarContenido(params),
  });
}

export function useContenidoItemAdmin(id) {
  return useQuery({
    queryKey: contenidoAdminKeys.detail(id),
    queryFn: () => contenidoAdminService.obtenerContenido(id),
    enabled: Boolean(id),
  });
}

export function useCrearContenidoAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contenidoAdminService.crearContenido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contenidoAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['branding'] });
      queryClient.invalidateQueries({ queryKey: ['contenido'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'branding'] });
    },
  });
}

export function useActualizarContenidoAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => contenidoAdminService.actualizarContenido(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contenidoAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: contenidoAdminKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['branding'] });
      queryClient.invalidateQueries({ queryKey: ['contenido'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'branding'] });
    },
  });
}

export function useDesactivarContenidoAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contenidoAdminService.desactivarContenido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contenidoAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['branding'] });
      queryClient.invalidateQueries({ queryKey: ['contenido'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'branding'] });
    },
  });
}

export function useReactivarContenidoAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => contenidoAdminService.actualizarContenido(id, { activo: true }),
    meta: { toastMessage: 'Texto reactivado' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contenidoAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['branding'] });
      queryClient.invalidateQueries({ queryKey: ['contenido'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'branding'] });
    },
  });
}
