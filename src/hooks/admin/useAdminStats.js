import { useQuery } from '@tanstack/react-query';
import * as statsAdminService from '../../services/admin/statsAdminService.js';

export const statsKeys = {
  all: ['admin', 'stats'],
};

export function useAdminStats() {
  return useQuery({
    queryKey: statsKeys.all,
    queryFn: statsAdminService.obtenerStats,
  });
}
