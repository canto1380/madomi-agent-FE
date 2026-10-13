import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import { useCrmConversacionAdmin } from '../../../hooks/admin/useCrmAdmin.js';
import { formatearFecha } from '../../../utils/admin/crmCatalog.js';

function etiquetaRol(rol) {
  if (rol === 'user') return 'Cliente';
  if (rol === 'assistant') return 'Asistente';
  return rol;
}

export default function ComercialConversacionPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useCrmConversacionAdmin(id);

  return (
    <PageLayout
      title="Conversación"
      description={data ? `Canal ${data.canal}` : 'Historial de mensajes'}
      actions={
        data?.leadId ? (
          <Link to={`/admin/comercial/leads/${data.leadId}`} className="adminLink">
            ← Lead
          </Link>
        ) : (
          <Link to="/admin/comercial/leads" className="adminLink">
            ← Leads
          </Link>
        )
      }
    >
      {isError && <Alert variant="error">{error.message}</Alert>}
      {isLoading && <p className="adminMuted">Cargando mensajes…</p>}

      {data && (
        <>
          <div className="crmConversacionMeta">
            {data.escaladoHumano && <Badge variant="warning">Escalado a humano</Badge>}
            <span className="adminMuted">Actualizado {formatearFecha(data.updatedAt)}</span>
          </div>
          <div className="crmChatThread">
            {(data.mensajes ?? []).map((m, index) => (
              <article
                key={`${m.createdAt}-${index}`}
                className={`crmChatBubble crmChatBubble--${m.rol === 'user' ? 'user' : 'assistant'}`}
              >
                <header className="crmChatBubble__head">
                  <strong>{etiquetaRol(m.rol)}</strong>
                  <time dateTime={m.createdAt}>{formatearFecha(m.createdAt)}</time>
                </header>
                <p className="crmChatBubble__body">{m.contenido}</p>
              </article>
            ))}
            {!data.mensajes?.length && <p className="adminMuted">Sin mensajes en esta conversación.</p>}
          </div>
        </>
      )}
    </PageLayout>
  );
}
