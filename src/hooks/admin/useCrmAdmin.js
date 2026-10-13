import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as crmAdminService from '../../services/admin/crmAdminService.js';

export const crmAdminKeys = {
  all: ['admin', 'crm'],
  statsResumen: () => [...crmAdminKeys.all, 'stats', 'resumen'],
  statsCuello: () => [...crmAdminKeys.all, 'stats', 'cuello'],
  leads: (params) => [...crmAdminKeys.all, 'leads', params],
  lead: (id) => [...crmAdminKeys.all, 'lead', id],
  conversacion: (id) => [...crmAdminKeys.all, 'conversacion', id],
  presupuestos: (params) => [...crmAdminKeys.all, 'presupuestos', params],
  pedidos: (params) => [...crmAdminKeys.all, 'pedidos', params],
};

export function useCrmStatsResumen() {
  return useQuery({
    queryKey: crmAdminKeys.statsResumen(),
    queryFn: crmAdminService.obtenerStatsResumenCrm,
  });
}

export function useCrmStatsCuelloBotella() {
  return useQuery({
    queryKey: crmAdminKeys.statsCuello(),
    queryFn: crmAdminService.obtenerStatsCuelloBotellaCrm,
  });
}

export function useCrmLeadsAdmin(params = {}) {
  return useQuery({
    queryKey: crmAdminKeys.leads(params),
    queryFn: () => crmAdminService.listarLeadsCrm(params),
  });
}

export function useCrmLeadAdmin(id) {
  return useQuery({
    queryKey: crmAdminKeys.lead(id),
    queryFn: () => crmAdminService.obtenerLeadCrm(id),
    enabled: Boolean(id),
  });
}

export function useActualizarLeadCrm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => crmAdminService.actualizarLeadCrm(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: crmAdminKeys.lead(id) });
      queryClient.invalidateQueries({ queryKey: [...crmAdminKeys.all, 'leads'] });
      queryClient.invalidateQueries({ queryKey: crmAdminKeys.statsResumen() });
    },
  });
}

export function useCrmConversacionAdmin(id) {
  return useQuery({
    queryKey: crmAdminKeys.conversacion(id),
    queryFn: () => crmAdminService.obtenerConversacionCrm(id),
    enabled: Boolean(id),
  });
}

export function useCrmPresupuestosAdmin(params = {}, queryOptions = {}) {
  return useQuery({
    queryKey: crmAdminKeys.presupuestos(params),
    queryFn: () => crmAdminService.listarPresupuestosCrm(params),
    ...queryOptions,
  });
}

export function useCrmPedidosAdmin(params = {}, queryOptions = {}) {
  return useQuery({
    queryKey: crmAdminKeys.pedidos(params),
    queryFn: () => crmAdminService.listarPedidosCrm(params),
    ...queryOptions,
  });
}

export function useActualizarPedidoCrm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => crmAdminService.actualizarPedidoCrm(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...crmAdminKeys.all, 'pedidos'] });
    },
  });
}

export function usePublicarContextoCrm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crmAdminService.publicarContextoCrm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'asistente'] });
    },
  });
}
