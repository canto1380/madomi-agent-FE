import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Select } from '../../../components/admin/ui/Select.jsx';
import { LeadEstadoBadge } from '../../../components/admin/comercial/LeadEstadoBadge.jsx';
import {
  useActualizarLeadCrm,
  useCrmLeadAdmin,
  useCrmPedidosAdmin,
  useCrmPresupuestosAdmin,
} from '../../../hooks/admin/useCrmAdmin.js';
import { usePermisosUsuario } from '../../../hooks/usePermisosUsuario.js';
import { PERMISOS_COMERCIAL } from '../../../constants/permisosAdmin.js';
import {
  CUELLOS_BOTELLA,
  ESTADOS_LEAD,
  etiquetaEstadoLogistico,
  etiquetaEstadoPresupuesto,
  formatearFecha,
  nombreCliente,
} from '../../../utils/admin/crmCatalog.js';
import { buildCrmListParams } from '../../../utils/admin/buildCrmListParams.js';

export default function ComercialLeadDetailPage() {
  const { id } = useParams();
  const { puede } = usePermisosUsuario();
  const puedeEscribir = puede(PERMISOS_COMERCIAL.ESCRIBIR);

  const leadQuery = useCrmLeadAdmin(id);
  const listParamsLead = useMemo(
    () =>
      id
        ? buildCrmListParams({
            filters: { leadId: id },
            sort: { key: 'createdAt', direction: 'desc' },
            page: 1,
            limit: 10,
          })
        : null,
    [id],
  );
  const presupuestosQuery = useCrmPresupuestosAdmin(listParamsLead ?? {}, {
    enabled: Boolean(listParamsLead?.leadId),
  });
  const pedidosQuery = useCrmPedidosAdmin(listParamsLead ?? {}, {
    enabled: Boolean(listParamsLead?.leadId),
  });
  const actualizarMutation = useActualizarLeadCrm();

  const lead = leadQuery.data;
  const [estado, setEstado] = useState('');
  const [cuelloBotella, setCuelloBotella] = useState('');
  const [notas, setNotas] = useState('');
  const [mensajeOk, setMensajeOk] = useState('');

  useEffect(() => {
    if (!lead) return;
    setEstado(lead.estado ?? '');
    setCuelloBotella(lead.cuelloBotella ?? '');
    setNotas(lead.notas ?? '');
  }, [lead]);

  const guardar = async (event) => {
    event.preventDefault();
    setMensajeOk('');
    try {
      await actualizarMutation.mutateAsync({
        id,
        payload: {
          estado: estado || undefined,
          cuelloBotella: cuelloBotella || null,
          notas: notas.trim() || null,
        },
      });
      setMensajeOk('Lead actualizado.');
    } catch (err) {
      // mutation error shown below
    }
  };

  return (
    <PageLayout
      title="Detalle del lead"
      description={lead ? nombreCliente(lead.cliente) : 'Cargando…'}
      actions={
        <Link to="/admin/comercial/leads" className="adminLink">
          ← Volver a leads
        </Link>
      }
    >
      {leadQuery.isError && <Alert variant="error">{leadQuery.error.message}</Alert>}
      {actualizarMutation.isError && (
        <Alert variant="error">{actualizarMutation.error.message}</Alert>
      )}
      {mensajeOk && <Alert variant="success">{mensajeOk}</Alert>}

      {leadQuery.isLoading && <p className="adminMuted">Cargando lead…</p>}

      {lead && (
        <>
          <section className="crmDetailGrid">
            <div className="crmDetailCard">
              <h2 className="crmDetailCard__title">Resumen</h2>
              <p>
                Estado: <LeadEstadoBadge estado={lead.estado} />
              </p>
              <p>Localidad: {lead.localidad ?? lead.cliente?.localidad ?? '—'}</p>
              {lead.requiereContactoComercial && (
                <p className="crmAlertInline">
                  <strong>Contactar al cliente</strong>
                  {lead.seguimientoComercial?.motivo
                    ? ` · ${lead.seguimientoComercial.motivo.replace(/_/g, ' ')}`
                    : ''}
                  {lead.seguimientoComercial?.preferenciaCanal
                    ? ` · Prefiere: ${lead.seguimientoComercial.preferenciaCanal}`
                    : ''}
                  {lead.seguimientoComercial?.notas ? (
                    <>
                      <br />
                      <span className="adminMuted">{lead.seguimientoComercial.notas}</span>
                    </>
                  ) : null}
                </p>
              )}
              {(lead.datosCapturados?.nombre || lead.datosCapturados?.telefono) && (
                <p>
                  Datos chat:{' '}
                  {[lead.datosCapturados?.nombre, lead.datosCapturados?.apellido]
                    .filter(Boolean)
                    .join(' ')}
                  {lead.datosCapturados?.telefono ? ` · ${lead.datosCapturados.telefono}` : ''}
                </p>
              )}
              <p>Último mensaje: {formatearFecha(lead.ultimoMensajeAt)}</p>
              <p>Actualizado: {formatearFecha(lead.updatedAt)}</p>
              {lead.cliente?.telefono && (
                <p>
                  WhatsApp:{' '}
                  <a href={`https://wa.me/${lead.cliente.telefonoNormalizado ?? lead.cliente.telefono}`} target="_blank" rel="noreferrer">
                    {lead.cliente.telefono}
                  </a>
                </p>
              )}
            </div>

            {lead.conversacion && (
              <div className="crmDetailCard">
                <h2 className="crmDetailCard__title">Conversación</h2>
                <p>{lead.conversacion.mensajesCount} mensajes</p>
                <ul className="crmMensajesPreview">
                  {lead.conversacion.ultimosMensajes?.map((m, i) => (
                    <li key={`${m.createdAt}-${i}`}>
                      <strong>{m.rol}:</strong> {m.contenido}
                    </li>
                  ))}
                </ul>
                <Link to={`/admin/comercial/conversaciones/${lead.conversacion.id}`} className="adminLink">
                  Ver hilo completo →
                </Link>
              </div>
            )}
          </section>

          <section className="crmDetailGrid">
            <div className="crmDetailCard">
              <h2 className="crmDetailCard__title">Presupuestos</h2>
              {presupuestosQuery.isLoading && <p className="adminMuted">Cargando…</p>}
              {presupuestosQuery.isError && (
                <Alert variant="error">{presupuestosQuery.error.message}</Alert>
              )}
              <ul className="crmEmbudoList">
                {(presupuestosQuery.data?.items ?? []).map((p) => (
                  <li key={p.id}>
                    <span>
                      {formatearFecha(p.createdAt)} · {etiquetaEstadoPresupuesto(p.estado)}
                      {p.total != null
                        ? ` · ${p.moneda ?? 'ARS'} ${Number(p.total).toLocaleString('es-AR')}`
                        : ''}
                    </span>
                    {p.pdfUrl ? (
                      <a href={p.pdfUrl} target="_blank" rel="noreferrer" className="adminLink">
                        PDF
                      </a>
                    ) : (
                      <span className="adminMuted">—</span>
                    )}
                  </li>
                ))}
                {!presupuestosQuery.isLoading && !(presupuestosQuery.data?.items ?? []).length && (
                  <li className="adminMuted">Sin presupuestos para este lead.</li>
                )}
              </ul>
              <Link to="/admin/comercial/presupuestos" className="adminLink">
                Ver todos →
              </Link>
            </div>

            <div className="crmDetailCard">
              <h2 className="crmDetailCard__title">Pedidos</h2>
              {pedidosQuery.isLoading && <p className="adminMuted">Cargando…</p>}
              {pedidosQuery.isError && <Alert variant="error">{pedidosQuery.error.message}</Alert>}
              <ul className="crmEmbudoList">
                {(pedidosQuery.data?.items ?? []).map((ped) => (
                  <li key={ped.id}>
                    <span>
                      {formatearFecha(ped.createdAt)} · {etiquetaEstadoLogistico(ped.estadoLogistico)}
                      {ped.totales?.total != null
                        ? ` · ${ped.totales.moneda ?? 'ARS'} ${Number(ped.totales.total).toLocaleString('es-AR')}`
                        : ''}
                    </span>
                  </li>
                ))}
                {!pedidosQuery.isLoading && !(pedidosQuery.data?.items ?? []).length && (
                  <li className="adminMuted">Sin pedidos para este lead.</li>
                )}
              </ul>
              <Link to="/admin/comercial/pedidos" className="adminLink">
                Ver todos →
              </Link>
            </div>
          </section>

          {puedeEscribir ? (
            <form className="crmLeadForm" onSubmit={guardar}>
              <h2 className="crmDetailCard__title">Gestión manual</h2>
              <Select
                label="Estado"
                name="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                options={ESTADOS_LEAD}
              />
              <Select
                label="Cuello de botella"
                name="cuelloBotella"
                value={cuelloBotella}
                onChange={(e) => setCuelloBotella(e.target.value)}
                options={CUELLOS_BOTELLA}
              />
              <div className="admin-field">
                <label className="admin-field__label" htmlFor="notasAdmin">
                  Notas internas
                </label>
                <textarea
                  id="notasAdmin"
                  className="admin-field__input crmTextarea"
                  rows={4}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={actualizarMutation.isPending}>
                {actualizarMutation.isPending ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </form>
          ) : (
            <Alert variant="info">Tu rol solo permite lectura en CRM.</Alert>
          )}
        </>
      )}
    </PageLayout>
  );
}
