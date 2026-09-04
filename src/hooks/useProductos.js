import { useQuery } from '@tanstack/react-query';
import { obtenerProductos } from '../services/productosService.js';

export const productosKeys = {
  all: ['productos'],
  list: () => [...productosKeys.all, 'list'],
};

export function useProductos() {
  return useQuery({
    queryKey: productosKeys.list(),
    queryFn: obtenerProductos,
    staleTime: 1000 * 60 * 10,
  });
}
