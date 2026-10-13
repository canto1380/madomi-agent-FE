import { Link } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { AdminStatCard } from '../../../components/admin/ui/AdminStatCard.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import {
  useActualizarAsistenteBotAdmin,
  useAsistenteEmpresaAdmin,
} from '../../../hooks/admin/useAsistenteAdmin.js';
import { useCrmStatsCuelloBotella, useCrmStatsResumen } from '../../../hooks/admin/useCrmAdmin.js';
import { usePermisosUsuario } from '../../../hooks/usePermisosUsuario.js';
import { PERMISOS_COMERCIAL } from '../../../constants/permisosAdmin.js';
import { etiquetaCuelloBotella, etiquetaEstadoLead } from '../../../utils/admin/crmCatalog.js';

function mensajeErrorCrm(error) {
  if (error?.code === 'CRM_DISABLED' || error?.message?.includes('503')) {
    return 'CRM deshabilitado o MongoDB no disponible.';
  }
  return error?.message ?? 'Error al cargar datos';
}

export default function ComercialDashboardPage() {
  const { puede } = usePermisosUsuario();
  const puedeEscribir = puede(PERMISOS_COMERCIAL.ESCRIBIR);
  const empresaQuery = useAsistenteEmpresaAdmin();
  const actualizarBotMutation = useActualizarAsistenteBotAdmin();
  const statsQuery = useCrmStatsResumen();
  const cuelloQuery = useCrmStatsCuelloBotella();

  const empresa = empresaQuery.data;
  const bot = empresa?.asistenteBot;
  const stats = statsQuery.data;
  const cuelloStats = cuelloQuery.data;
  const embudo = stats?.embudo ?? {};

  const leadsActivos =
    stats?.totalLeads != null
      ? stats.totalLeads - (embudo.abandonado ?? 0) - (embudo.pedido_cerrado ?? 0)
      : null;

  return (
    <PageLayout title="Comercial" description="Pedidos, leads y asistente de la landing.">
      {(empresaQuery.isError || statsQuery.isError || cuelloQuery.isError) && (
        <Alert variant="error">
          {mensajeErrorCrm(empresaQuery.error ?? statsQuery.error ?? cuelloQuery.error)}
        </Alert>
      )}

      <section className="adminDashboard">
        <div className="adminDashboard__group">
          <h2 className="adminDashboard__sectionTitle">Operación</h2>
          <div className="adminDashboard__stats">
            <AdminStatCard
              label="Leads totales"
              value={stats?.totalLeads ?? 0}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/comercial/leads"
              actionLabel="Ver leads"
            />
            <AdminStatCard
              label="Leads en curso"
              value={leadsActivos ?? '—'}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/comercial/leads"
              actionLabel="Gestionar"
            />
            <AdminStatCard
              label="Pedidos cerrados"
              value={embudo.pedido_cerrado ?? 0}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/comercial/pedidos"
              actionLabel="Ver pedidos"
            />
            <AdminStatCard
              label="Conversión presup. → pedido"
              value={
                stats?.conversionPresupuestoEnviadoAPedido != null
                  ? `${(stats.conversionPresupuestoEnviadoAPedido * 100).toFixed(1)}%`
                  : '—'
              }
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/comercial/presupuestos"
              actionLabel="Presupuestos"
            />
          </div>
        </div>

        {stats && (
          <div className="adminDashboard__group">
            <h2 className="adminDashboard__sectionTitle">Embudo</h2>
            <ul className="crmEmbudoList">
              {Object.entries(embudo).map(([estado, total]) => (
                <li key={estado}>
                  <span>{etiquetaEstadoLead(estado)}</span>
                  <strong>{total}</strong>
                </li>
              ))}
              {!Object.keys(embudo).length && <li className="adminMuted">Sin datos de embudo aún.</li>}
            </ul>
          </div>
        )}

        {stats?.topLocalidades?.length > 0 && (
          <div className="adminDashboard__group">
            <h2 className="adminDashboard__sectionTitle">Top localidades</h2>
            <ul className="crmEmbudoList">
              {stats.topLocalidades.map((row) => (
                <li key={row.localidad}>
                  <span>{row.localidad}</span>
                  <strong>{row.total}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {stats?.productosMasConsultados?.length > 0 && (
          <div className="adminDashboard__group">
            <h2 className="adminDashboard__sectionTitle">Productos más consultados</h2>
            <ul className="crmEmbudoList">
              {stats.productosMasConsultados.map((row) => (
                <li key={row.productoId ?? row.nombre}>
                  <span>
                    {row.nombre || row.productoId || '—'}
                    {row.nombre && row.productoId ? ` (${row.productoId})` : ''}
                  </span>
                  <strong>{row.total}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(cuelloStats?.porCuelloBotella?.length > 0 || cuelloStats?.motivosAbandono?.length > 0) && (
          <div className="adminDashboard__group">
            <h2 className="adminDashboard__sectionTitle">Cuellos de botella y abandono</h2>
            {cuelloQuery.isLoading && <p className="adminMuted">Cargando…</p>}
            {cuelloStats?.porCuelloBotella?.length > 0 && (
              <>
                <h3 className="adminDashboard__subsectionTitle">Por cuello marcado</h3>
                <ul className="crmEmbudoList">
                  {cuelloStats.porCuelloBotella.map((row) => (
                    <li key={row.cuello ?? 'sin'}>
                      <span>{etiquetaCuelloBotella(row.cuello)}</span>
                      <strong>{row.total}</strong>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {cuelloStats?.motivosAbandono?.length > 0 && (
              <>
                <h3 className="adminDashboard__subsectionTitle">Motivos de abandono</h3>
                <ul className="crmEmbudoList">
                  {cuelloStats.motivosAbandono.map((row) => (
                    <li key={row.motivo ?? 'otro'}>
                      <span>{row.motivo || 'Sin motivo'}</span>
                      <strong>{row.total}</strong>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <div className="adminDashboard__group">
          <h2 className="adminDashboard__sectionTitle">Asistente</h2>
          {empresaQuery.isLoading && <p className="adminMuted">Cargando configuración…</p>}
          {empresa && (
            <div className="adminDashboard__panel">
              <p>
                <strong>{empresa.nombre}</strong> · slug <code>{empresa.slug}</code>
              </p>
              {bot ? (
                <>
                  <p>
                    Bot <strong>{bot.nombre}</strong> · {bot.modelo}{' '}
                    <Badge variant={bot.activo ? 'success' : 'muted'}>
                      {bot.activo ? 'Activo en la landing' : 'Inactivo'}
                    </Badge>
                  </p>
                  {puedeEscribir ? (
                    <label className="crmBotToggle admin-field">
                      <input
                        type="checkbox"
                        checked={Boolean(bot.activo)}
                        disabled={actualizarBotMutation.isPending}
                        onChange={(e) =>
                          actualizarBotMutation.mutate({ activo: e.target.checked })
                        }
                      />
                      <span>Mostrar asistente en la web pública</span>
                    </label>
                  ) : (
                    <p className="adminMuted">
                      {bot.activo
                        ? 'El widget de chat está visible para visitantes.'
                        : 'El widget no se muestra hasta activar el bot.'}
                    </p>
                  )}
                </>
              ) : (
                <Alert variant="warning">No hay bot configurado en Mongo.</Alert>
              )}
              {actualizarBotMutation.isError && (
                <Alert variant="error">{actualizarBotMutation.error.message}</Alert>
              )}
              <p className="adminMuted">
                Requisitos: <code>FEATURE_ASISTENTE=true</code>, Mongo conectado, productos con datos
                comerciales en CMS.
              </p>
              <Link to="/admin/comercial/contexto" className="adminLink">
                Contexto y políticas →
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
