import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productosAdminService from '../../services/admin/productosAdminService.js';
import * as productoUploadService from '../../services/admin/productoUploadService.js';

export const productosAdminKeys = {
  all: ['admin', 'productos'],
  list: (params) => [...productosAdminKeys.all, 'list', params],
  detail: (id) => [...productosAdminKeys.all, 'detail', id],
};

export function useProductosAdmin(params = {}) {
  return useQuery({
    queryKey: productosAdminKeys.list(params),
    queryFn: () => productosAdminService.listarProductos(params),
  });
}

export function useProductoAdmin(id) {
  return useQuery({
    queryKey: productosAdminKeys.detail(id),
    queryFn: () => productosAdminService.obtenerProducto(id),
    enabled: Boolean(id),
  });
}

export function useCrearProductoAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productosAdminService.crearProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['productos', 'destacados'] });
    },
  });
}

export function useActualizarProductoAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => productosAdminService.actualizarProducto(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productosAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: productosAdminKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['productos', 'destacados'] });
    },
  });
}

export function useDesactivarProductoAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productosAdminService.desactivarProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['productos', 'destacados'] });
    },
  });
}

export function useReactivarProductoAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productosAdminService.actualizarProducto(id, { activo: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['productos', 'destacados'] });
    },
  });
}

export function useSubirImagenProductoAdmin() {
  return useMutation({
    mutationFn: ({ file, productoId, previousUrl }) =>
      productoUploadService.subirImagenProducto(file, { productoId, previousUrl }),
  });
}
