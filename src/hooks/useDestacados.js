import { useQuery } from '@tanstack/react-query';
import { obtenerDestacados } from '../services/destacadosService.js';

export const destacadosKeys = {
  all: ['productos', 'destacados'],
  list: (seccion) => [...destacadosKeys.all, seccion],
};

export function useDestacados(seccion = 'lo_ultimo') {
  return useQuery({
    queryKey: destacadosKeys.list(seccion),
    queryFn: () => obtenerDestacados(seccion),
    staleTime: 1000 * 60 * 5,
  });
}
