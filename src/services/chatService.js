import apiRequest from './api.js';
import {
  resolverChatStreamTimeoutMs,
  urlApiChat,
} from './chatApiBase.js';

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
  const blocks = buffer.split(/\n\n/);
  for (const block of blocks) {
    if (!block.trim()) continue;
    let event = 'message';
    let dataLine = '';
    for (const line of block.split(/\n/)) {
      const trimmed = line.replace(/\r$/, '');
      if (trimmed.startsWith('event:')) {
        event = trimmed.slice(6).trim();
      } else if (trimmed.startsWith('data:')) {
        dataLine += trimmed.slice(5).trim();
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

function crearSignalConTimeout(outerSignal, timeoutMs) {
  let timeoutSignal = null;
  if (typeof AbortSignal.timeout === 'function') {
    timeoutSignal = AbortSignal.timeout(timeoutMs);
  }
  if (outerSignal && timeoutSignal) {
    if (typeof AbortSignal.any === 'function') {
      return AbortSignal.any([outerSignal, timeoutSignal]);
    }
    return timeoutSignal;
  }
  return timeoutSignal ?? outerSignal;
}

function esPayloadDoneValido(payload) {
  return Boolean(payload && typeof payload === 'object' && typeof payload.respuesta === 'string');
}

function esErrorRecuperableChat(err) {
  const msg = err?.message ?? '';
  const name = err?.name ?? '';
  return (
    name === 'TimeoutError' ||
    name === 'AbortError' ||
    /incomplete|aborted|network|fetch|stream|terminated|body stream|failed to fetch|load failed/i.test(
      msg,
    )
  );
}

async function aplicarRespuestaEnUi(data, { onDelta, onReplace }) {
  const texto = data?.respuesta ?? '';
  if (!texto) {
    return data;
  }
  if (onReplace) {
    onReplace(texto);
  } else if (onDelta) {
    onDelta(texto);
  }
  return data;
}

/**
 * Lee SSE de POST /api/chat. Si el stream falla, reintenta una vez en JSON (sin Accept SSE).
 */
async function leerChatSse({
  sessionAnonimaId,
  mensaje,
  onDelta,
  onReplace,
  signal,
}) {
  const timeoutMs = resolverChatStreamTimeoutMs();
  const combinedSignal = crearSignalConTimeout(signal, timeoutMs);

  const res = await fetch(urlApiChat('/api/chat'), {
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
    signal: combinedSignal,
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

  const procesarEventos = (events) => {
    for (const { event, data } of events) {
      if (event === 'delta' && data?.text && onDelta) {
        onDelta(data.text);
      }
      if (event === 'replace' && data?.text && onReplace) {
        onReplace(data.text);
      }
      if (event === 'done' && esPayloadDoneValido(data)) {
        donePayload = data;
      }
      if (event === 'error') {
        const error = new Error(data?.message ?? 'Error en el asistente');
        error.code = data?.code;
        throw error;
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split(/\n\n/);
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      if (!part.trim()) continue;
      procesarEventos(parseSseBuffer(`${part}\n\n`));
    }
  }

  if (buffer.trim()) {
    procesarEventos(parseSseBuffer(`${buffer}\n\n`));
  }

  if (!esPayloadDoneValido(donePayload)) {
    throw new Error('Respuesta incompleta del asistente');
  }

  return donePayload;
}

export async function enviarMensajeChatStream(params) {
  try {
    return await leerChatSse(params);
  } catch (err) {
    if (!esErrorRecuperableChat(err)) {
      throw err;
    }
    const data = await enviarMensajeChat({
      sessionAnonimaId: params.sessionAnonimaId,
      mensaje: params.mensaje,
    });
    await aplicarRespuestaEnUi(data, params);
    return data;
  }
}
