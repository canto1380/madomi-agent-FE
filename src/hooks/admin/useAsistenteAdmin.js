import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as asistenteAdminService from '../../services/admin/asistenteAdminService.js';

export const asistenteAdminKeys = {
  all: ['admin', 'asistente'],
  empresa: () => [...asistenteAdminKeys.all, 'empresa'],
  contextos: (params) => [...asistenteAdminKeys.all, 'contextos', params],
  contextoVigente: (tipo) => [...asistenteAdminKeys.all, 'contexto-vigente', tipo],
};

export function useAsistenteEmpresaAdmin() {
  return useQuery({
    queryKey: asistenteAdminKeys.empresa(),
    queryFn: asistenteAdminService.obtenerEmpresaAsistente,
  });
}

export function useAsistenteContextosAdmin(params = {}) {
  return useQuery({
    queryKey: asistenteAdminKeys.contextos(params),
    queryFn: () => asistenteAdminService.listarContextosAsistente(params),
  });
}

export function useAsistenteContextoVigenteAdmin(tipo, options = {}) {
  return useQuery({
    queryKey: asistenteAdminKeys.contextoVigente(tipo),
    queryFn: () => asistenteAdminService.obtenerContextoVigenteAsistente(tipo),
    enabled: Boolean(tipo) && (options.enabled ?? true),
  });
}

export function useActualizarAsistenteBotAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: asistenteAdminService.actualizarAsistenteBot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asistenteAdminKeys.empresa() });
    },
  });
}
