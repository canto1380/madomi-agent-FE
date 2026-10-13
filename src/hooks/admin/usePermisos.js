import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as permisosService from '../../services/admin/permisosService.js';

export const permisosKeys = {
  all: ['permisos'],
  list: () => [...permisosKeys.all, 'list'],
};

export function usePermisos() {
  return useQuery({
    queryKey: permisosKeys.list(),
    queryFn: permisosService.listarPermisos,
  });
}

export function useCrearPermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: permisosService.crearPermiso,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: permisosKeys.all }),
  });
}

export function useActualizarPermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => permisosService.actualizarPermiso(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: permisosKeys.all }),
  });
}

export function useEliminarPermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: permisosService.eliminarPermiso,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: permisosKeys.all }),
  });
}
