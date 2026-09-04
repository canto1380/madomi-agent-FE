import { useMutation } from '@tanstack/react-query';
import { enviarContacto } from '../services/contactoService.js';

export function useEnviarContacto() {
  return useMutation({
    mutationFn: enviarContacto,
  });
}
