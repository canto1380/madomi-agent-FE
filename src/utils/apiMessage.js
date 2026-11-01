const mensajesApi = new WeakMap();

export function asociarMensajeApi(data, message) {
  if (data && typeof data === 'object') {
    mensajesApi.set(data, message ?? null);
  }
  return data;
}

export function leerMensajeApi(data) {
  if (!data || typeof data !== 'object') return null;
  const message = mensajesApi.get(data);
  return typeof message === 'string' && message.trim() ? message : null;
}
