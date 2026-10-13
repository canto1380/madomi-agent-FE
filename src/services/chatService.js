import apiRequest from './api.js';

const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerEstadoChat() {
  try {
    return await apiRequest('/api/chat/estado');
  } catch {
    return { disponible: false, codigo: 'ERROR_RED' };
  }
}

export async function enviarMensajeChat({ sessionAnonimaId, mensaje }) {
  return apiRequest('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      sessionAnonimaId,
      mensaje,
      metadata: { canal: 'web_chat' },
    }),
  });
}

function parseSseBuffer(buffer) {
  const events = [];
  const blocks = buffer.split('\n\n');
  for (const block of blocks) {
    if (!block.trim()) continue;
    let event = 'message';
    let dataLine = '';
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLine += line.slice(5).trim();
      }
    }
    if (dataLine) {
      try {
        events.push({ event, data: JSON.parse(dataLine) });
      } catch {
        events.push({ event, data: dataLine });
      }
    }
  }
  return events;
}

/**
 * Chat con SSE (spec §6.4). onDelta recibe fragmentos de texto; resuelve con payload `done`.
 */
export async function enviarMensajeChatStream({
  sessionAnonimaId,
  mensaje,
  onDelta,
  onReplace,
  signal,
}) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      sessionAnonimaId,
      mensaje,
      metadata: { canal: 'web_chat' },
    }),
    signal,
  });

  const contentType = res.headers.get('content-type') ?? '';

  if (!contentType.includes('text/event-stream')) {
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(body.message || body.error || 'Error de servidor');
      error.status = res.status;
      error.code = body.error;
      throw error;
    }
    return body.data;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Streaming no soportado en este navegador');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let donePayload = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const events = parseSseBuffer(`${part}\n\n`);
      for (const { event, data } of events) {
        if (event === 'delta' && data?.text && onDelta) {
          onDelta(data.text);
        }
        if (event === 'replace' && data?.text && onReplace) {
          onReplace(data.text);
        }
        if (event === 'done') {
          donePayload = data;
        }
        if (event === 'error') {
          const error = new Error(data?.message ?? 'Error en el asistente');
          error.code = data?.code;
          throw error;
        }
      }
    }
  }

  if (buffer.trim()) {
    const events = parseSseBuffer(`${buffer}\n\n`);
    for (const { event, data } of events) {
      if (event === 'delta' && data?.text && onDelta) {
        onDelta(data.text);
      }
      if (event === 'replace' && data?.text && onReplace) {
        onReplace(data.text);
      }
      if (event === 'done') {
        donePayload = data;
      }
      if (event === 'error') {
        const error = new Error(data?.message ?? 'Error en el asistente');
        error.code = data?.code;
        throw error;
      }
    }
  }

  if (!donePayload) {
    throw new Error('Respuesta incompleta del asistente');
  }

  return donePayload;
}
