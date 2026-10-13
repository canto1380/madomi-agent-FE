const SESSION_KEY = 'madomi_chat_session_id';

function generarUuidV4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function obtenerSessionAnonimaId() {
  if (typeof window === 'undefined') return generarUuidV4();
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generarUuidV4();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function claveHistorialChat(sessionId) {
  return `madomi_chat_historial_${sessionId}`;
}

export function cargarHistorialChat(sessionId) {
  if (typeof window === 'undefined' || !sessionId) return [];
  try {
    const raw = sessionStorage.getItem(claveHistorialChat(sessionId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function guardarHistorialChat(sessionId, mensajes) {
  if (typeof window === 'undefined' || !sessionId) return;
  try {
    sessionStorage.setItem(claveHistorialChat(sessionId), JSON.stringify(mensajes.slice(-80)));
  } catch {
    // quota exceeded — ignorar
  }
}
