import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as categoriasAdminService from '../../services/admin/categoriasAdminService.js';

export const categoriasAdminKeys = {
  all: ['admin', 'categorias'],
  list: (params) => [...categoriasAdminKeys.all, 'list', params],
  detail: (id) => [...categoriasAdminKeys.all, 'detail', id],
};

export function useCategoriasAdmin(params = {}) {
  return useQuery({
    queryKey: categoriasAdminKeys.list(params),
    queryFn: () => categoriasAdminService.listarCategorias(params),
  });
}

export function useCategoriaAdmin(id) {
  return useQuery({
    queryKey: categoriasAdminKeys.detail(id),
    queryFn: () => categoriasAdminService.obtenerCategoria(id),
    enabled: Boolean(id),
  });
}

export function useCrearCategoriaAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriasAdminService.crearCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriasAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}

export function useActualizarCategoriaAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => categoriasAdminService.actualizarCategoria(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoriasAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriasAdminKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}

export function useDesactivarCategoriaAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriasAdminService.desactivarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriasAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}

export function useReactivarCategoriaAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoriasAdminService.actualizarCategoria(id, { activo: true }),
    meta: { toastMessage: 'Categoría reactivada' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriasAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}
