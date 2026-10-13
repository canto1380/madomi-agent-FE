import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  cargarHistorialChat,
  guardarHistorialChat,
  obtenerSessionAnonimaId,
} from '../utils/chatSession.js';
import {
  enviarMensajeChat,
  enviarMensajeChatStream,
  obtenerEstadoChat,
} from '../services/chatService.js';

const USAR_SSE = import.meta.env.VITE_CHAT_SSE !== 'false';

const CHAT_QUERY_KEY = ['public', 'chat', 'estado'];

function mensajeErrorUsuario(error) {
  if (error?.code === 'RATE_LIMIT') {
    return 'Demasiados mensajes seguidos. Esperá un momento e intentá de nuevo.';
  }
  if (error?.code === 'ASISTENTE_NO_DISPONIBLE' || error?.status === 503) {
    return 'El asistente no está disponible en este momento. Podés escribirnos por WhatsApp.';
  }
  const msg = error?.message ?? '';
  if (/network error|failed to fetch|load failed|incomplete/i.test(msg)) {
    return 'La respuesta tardó demasiado o se cortó la conexión. Esperá unos segundos e intentá de nuevo.';
  }
  return msg || 'No pudimos enviar tu mensaje. Intentá de nuevo.';
}

export function useChatWidget({ habilitado = true } = {}) {
  const sessionId = useMemo(() => obtenerSessionAnonimaId(), []);
  const estadoQuery = useQuery({
    queryKey: CHAT_QUERY_KEY,
    queryFn: obtenerEstadoChat,
    enabled: habilitado,
    staleTime: 60_000,
    retry: 1,
  });

  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState(() => cargarHistorialChat(sessionId));
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);
  const [meta, setMeta] = useState({ leadId: null, estadoLead: null });

  const disponible = Boolean(estadoQuery.data?.disponible);
  const nombreBot = estadoQuery.data?.nombreBot ?? 'Asistente Madomi';
  const mensajeBienvenida = estadoQuery.data?.mensajeBienvenida;

  useEffect(() => {
    guardarHistorialChat(sessionId, mensajes);
  }, [sessionId, mensajes]);

  useEffect(() => {
    if (!abierto || !disponible || !mensajeBienvenida) return;
    setMensajes((prev) => {
      if (prev.length > 0) return prev;
      return [
        {
          id: 'bienvenida',
          rol: 'assistant',
          contenido: mensajeBienvenida,
          createdAt: new Date().toISOString(),
        },
      ];
    });
  }, [abierto, disponible, mensajeBienvenida]);

  const enviar = useCallback(
    async (texto) => {
      const mensaje = texto.trim();
      if (!mensaje || enviando) return;

      setErrorEnvio(null);
      const userMsg = {
        id: `u-${Date.now()}`,
        rol: 'user',
        contenido: mensaje,
        createdAt: new Date().toISOString(),
      };
      setMensajes((prev) => [...prev, userMsg]);
      setEnviando(true);

      const assistantId = `a-${Date.now()}`;
      if (USAR_SSE) {
        setMensajes((prev) => [
          ...prev,
          {
            id: assistantId,
            rol: 'assistant',
            contenido: '',
            createdAt: new Date().toISOString(),
            streaming: true,
          },
        ]);
      }

      try {
        let data;
        if (USAR_SSE) {
          data = await enviarMensajeChatStream({
            sessionAnonimaId: sessionId,
            mensaje,
            onDelta: (fragmento) => {
              setMensajes((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, contenido: `${m.contenido}${fragmento}` } : m,
                ),
              );
            },
            onReplace: (textoCompleto) => {
              setMensajes((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, contenido: textoCompleto } : m,
                ),
              );
            },
          });
          setMensajes((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    contenido: data.respuesta ?? m.contenido,
                    acciones: data.acciones ?? [],
                    streaming: false,
                  }
                : m,
            ),
          );
        } else {
          data = await enviarMensajeChat({ sessionAnonimaId: sessionId, mensaje });
          setMensajes((prev) => [
            ...prev,
            {
              id: assistantId,
              rol: 'assistant',
              contenido: data.respuesta ?? '…',
              createdAt: new Date().toISOString(),
              acciones: data.acciones ?? [],
            },
          ]);
        }
        setMeta({
          leadId: data.leadId ?? null,
          estadoLead: data.estadoLead ?? null,
        });
      } catch (err) {
        if (USAR_SSE) {
          setMensajes((prev) => prev.filter((m) => m.id !== assistantId));
        }
        setErrorEnvio(mensajeErrorUsuario(err));
      } finally {
        setEnviando(false);
      }
    },
    [enviando, sessionId],
  );

  const toggle = useCallback(() => setAbierto((v) => !v), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  return {
    sessionId,
    abierto,
    toggle,
    cerrar,
    mensajes,
    enviar,
    enviando,
    errorEnvio,
    meta,
    disponible,
    nombreBot,
    cargandoEstado: estadoQuery.isLoading,
    estadoError: estadoQuery.isError,
    codigoEstado: estadoQuery.data?.codigo ?? null,
  };
}
