import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as mediaAdminService from '../../services/admin/mediaAdminService.js';
import * as mediaUploadService from '../../services/admin/mediaUploadService.js';

export const mediaAdminKeys = {
  all: ['admin', 'media'],
  list: (params) => [...mediaAdminKeys.all, 'list', params],
  detail: (id) => [...mediaAdminKeys.all, 'detail', id],
};

export function useMediaAdmin(params = {}) {
  return useQuery({
    queryKey: mediaAdminKeys.list(params),
    queryFn: () => mediaAdminService.listarMedia(params),
  });
}

export function useMediaItemAdmin(id) {
  return useQuery({
    queryKey: mediaAdminKeys.detail(id),
    queryFn: () => mediaAdminService.obtenerMedia(id),
    enabled: Boolean(id),
  });
}

export function useCrearMediaAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaAdminService.crearMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'media'] });
    },
  });
}

export function useActualizarMediaAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => mediaAdminService.actualizarMedia(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: mediaAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: mediaAdminKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'media'] });
    },
  });
}

export function useDesactivarMediaAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaAdminService.desactivarMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'media'] });
    },
  });
}

export function useReactivarMediaAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => mediaAdminService.actualizarMedia(id, { activo: true }),
    meta: { toastMessage: 'Media reactivado' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['site', 'media'] });
    },
  });
}

export function useSubirArchivoMediaAdmin() {
  return useMutation({
    mutationFn: ({ file, clave, carpeta, modulo, previousUrl }) =>
      mediaUploadService.subirArchivoMedia(file, { clave, carpeta, modulo, previousUrl }),
  });
}
