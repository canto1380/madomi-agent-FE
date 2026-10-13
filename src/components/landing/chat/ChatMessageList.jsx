import { useEffect, useRef } from 'react';
import { useSiteContenido } from '../../../providers/SiteContenidoProvider.jsx';

function etiquetaAccion(accion) {
  if (accion.tipo === 'solicitar_dato' && accion.campo === 'telefono') {
    return 'Compartí tu teléfono cuando quieras continuar.';
  }
  if (accion.tipo === 'solicitar_dato' && accion.campo === 'localidad') {
    return 'Contanos tu localidad para calcular el envío.';
  }
  return null;
}

export function ChatMessageList({ mensajes, enviando }) {
  const endRef = useRef(null);
  const { site } = useSiteContenido();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [mensajes, enviando]);

  return (
    <div className="chatMessageList" role="log" aria-live="polite" aria-relevant="additions">
      {mensajes.map((m) => (
        <article
          key={m.id}
          className={`chatBubble chatBubble${m.rol === 'user' ? 'User' : 'Assistant'}`}
        >
          <p className="chatBubbleBody">
            {m.contenido ||
              (m.streaming ? (
                <>
                  <span className="chatTypingDots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="visuallyHidden">El asistente está escribiendo</span>
                </>
              ) : null)}
          </p>
          {m.acciones?.length > 0 && (
            <ul className="chatBubbleHints">
              {m.acciones.map((accion, i) => {
                const hint = etiquetaAccion(accion);
                if (!hint) return null;
                return (
                  <li key={`${m.id}-hint-${i}`} className="chatBubbleHint">
                    {hint}
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      ))}

      {enviando && !mensajes.some((m) => m.streaming) && (
        <article className="chatBubble chatBubbleAssistant chatBubbleTyping" aria-busy="true">
          <p className="chatBubbleBody">
            <span className="chatTypingDots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="visuallyHidden">El asistente está escribiendo</span>
          </p>
        </article>
      )}

      {!mensajes.length && !enviando && (
        <p className="chatMessageEmpty">
          Consultanos por productos, precios mayoristas/minoristas o envíos a tu zona.
        </p>
      )}

      <div ref={endRef} />
      <p className="chatMessageFooterNote">
        ¿Preferís hablar con alguien?{' '}
        <a href={site.contacto.whatsapp} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </p>
    </div>
  );
}
