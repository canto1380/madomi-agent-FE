import apiRequest from './api.js';

/**
 * Contrato API: POST /api/contacto → { data: { id, mensaje } }
 * Body: { nombre, email, telefono?, mensaje }
 */
export async function enviarContacto(payload) {
  return apiRequest('/api/contacto', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
