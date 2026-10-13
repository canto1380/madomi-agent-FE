import { useQuery } from '@tanstack/react-query';
import { obtenerCategorias } from '../services/categoriasService.js';

export const categoriasKeys = {
  all: ['categorias'],
  list: () => [...categoriasKeys.all, 'list'],
};

export function useCategorias() {
  return useQuery({
    queryKey: categoriasKeys.list(),
    queryFn: obtenerCategorias,
    staleTime: 1000 * 60 * 10,
  });
}
