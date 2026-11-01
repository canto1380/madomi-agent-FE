import { useEffect } from 'react';
import { useChatWidget } from '../../../hooks/useChatWidget.js';
import { useSiteContenido } from '../../../providers/SiteContenidoProvider.jsx';
import { ChatMessageList } from './ChatMessageList.jsx';
import { ChatComposer } from './ChatComposer.jsx';

function ChatLauncherIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="chatLauncherIcon">
      <path
        fill="currentColor"
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H5.2L4 17.2V4h16v12Z"
      />
    </svg>
  );
}

function mensajeNoDisponible(codigo) {
  if (codigo === 'BOT_INACTIVO') {
    return 'El asistente está desactivado. Escribinos por WhatsApp y te respondemos a la brevedad.';
  }
  return 'El asistente no está disponible ahora. Podés contactarnos por WhatsApp.';
}

export function ChatWidget() {
  const habilitado = import.meta.env.VITE_ENABLE_CHAT_WIDGET !== 'false';
  const { site } = useSiteContenido();
  const {
    abierto,
    toggle,
    cerrar,
    mensajes,
    enviar,
    enviando,
    errorEnvio,
    disponible,
    nombreBot,
    cargandoEstado,
    codigoEstado,
  } = useChatWidget({ habilitado });

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.body.classList.toggle('chatWidgetOpen', abierto);
    return () => document.body.classList.remove('chatWidgetOpen');
  }, [abierto]);

  if (!habilitado) {
    return null;
  }

  if (cargandoEstado) {
    return null;
  }

  if (!disponible && !abierto) {
    return null;
  }

  const panelId = 'madomi-chat-panel';

  return (
    <div className="chatWidgetRoot">
      {abierto && (
        <section
          id={panelId}
          className="chatPanel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatPanelTitle"
        >
          <header className="chatPanelHeader">
            <div>
              <h2 id="chatPanelTitle" className="chatPanelTitle">
                {nombreBot}
              </h2>
              <p className="chatPanelSubtitle">Consultas comerciales · Madomi Pastas</p>
            </div>
            <button type="button" className="chatPanelClose" onClick={cerrar} aria-label="Cerrar chat">
              ×
            </button>
          </header>

          {!disponible ? (
            <div className="chatPanelUnavailable">
              <p>{mensajeNoDisponible(codigoEstado)}</p>
            </div>
          ) : (
            <>
              <ChatMessageList mensajes={mensajes} enviando={enviando} />
              {errorEnvio && (
                <p className="chatPanelError" role="alert">
                  {errorEnvio}
                </p>
              )}
              <p className="chatPanelWhatsappNote">
                ¿Preferís hablar con alguien?{' '}
                <a href={site.contacto.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </p>
              <ChatComposer onEnviar={enviar} disabled={enviando} />
            </>
          )}
        </section>
      )}

      <button
        type="button"
        className={`chatLauncher ${abierto ? 'chatLauncherActive' : ''}`}
        onClick={toggle}
        aria-expanded={abierto}
        aria-controls={panelId}
        aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente comercial'}
      >
        <ChatLauncherIcon />
        <span className="chatLauncherLabel">Asistente</span>
      </button>
    </div>
  );
}
