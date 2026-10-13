import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { AdminPagination } from '../../../components/admin/ui/AdminPagination.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import { Select } from '../../../components/admin/ui/Select.jsx';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { useActualizarPedidoCrm, useCrmPedidosAdmin } from '../../../hooks/admin/useCrmAdmin.js';
import { buildCrmListParams } from '../../../utils/admin/buildCrmListParams.js';
import { ESTADOS_LOGISTICOS, etiquetaEstadoLogistico, formatearFecha } from '../../../utils/admin/crmCatalog.js';
import { usePermisosUsuario } from '../../../hooks/usePermisosUsuario.js';
import { PERMISOS_COMERCIAL } from '../../../constants/permisosAdmin.js';

const FILTER_DEFAULTS = { estadoLogistico: 'todos', page: '1' };

function formatMoneda(totales) {
  if (!totales?.total && totales?.total !== 0) return '—';
  const moneda = totales.moneda ?? 'ARS';
  return `${moneda} ${Number(totales.total).toLocaleString('es-AR')}`;
}

export default function ComercialPedidosPage() {
  const { puede } = usePermisosUsuario();
  const puedeEscribir = puede(PERMISOS_COMERCIAL.ESCRIBIR);
  const [sort, setSort] = useState({ key: 'createdAt', direction: 'desc' });
  const { getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);

  const estadoLogistico = getFilter('estadoLogistico', 'todos');
  const page = Math.max(1, Number(getFilter('page', '1')) || 1);

  const apiParams = useMemo(
    () =>
      buildCrmListParams({
        filters: { estadoLogistico },
        sort,
        page,
        limit: 20,
      }),
    [estadoLogistico, sort, page],
  );

  const { data, isLoading, isError, error } = useCrmPedidosAdmin(apiParams);
  const actualizarMutation = useActualizarPedidoCrm();
  const items = data?.items ?? [];

  const toggleSort = (key) => {
    setFilter('page', '1');
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key, direction: 'asc' };
      return { key: 'createdAt', direction: 'desc' };
    });
  };

  const cambiarEstado = useCallback(
    async (pedidoId, nuevoEstado) => {
      await actualizarMutation.mutateAsync({
        id: pedidoId,
        payload: { estadoLogistico: nuevoEstado },
      });
    },
    [actualizarMutation],
  );

  const columns = useMemo(
    () => [
      {
        key: 'createdAt',
        header: 'Fecha',
        sortable: true,
        render: (row) => formatearFecha(row.createdAt),
      },
      {
        key: 'total',
        header: 'Total',
        render: (row) => formatMoneda(row.totales),
      },
      {
        key: 'metodoPagoPreferido',
        header: 'Pago',
        render: (row) => row.metodoPagoPreferido ?? '—',
      },
      {
        key: 'estadoLogistico',
        header: 'Logística',
        sortable: true,
        render: (row) =>
          puedeEscribir ? (
            <Select
              className="crmInlineSelect"
              aria-label="Estado logístico"
              value={row.estadoLogistico}
              options={ESTADOS_LOGISTICOS}
              onChange={(e) => cambiarEstado(row.id, e.target.value)}
              disabled={actualizarMutation.isPending}
            />
          ) : (
            <Badge variant="default">{etiquetaEstadoLogistico(row.estadoLogistico)}</Badge>
          ),
      },
      {
        key: 'leadId',
        header: 'Lead',
        render: (row) =>
          row.leadId ? (
            <Link to={`/admin/comercial/leads/${row.leadId}`} className="adminLink">
              Ver
            </Link>
          ) : (
            '—'
          ),
      },
    ],
    [puedeEscribir, actualizarMutation.isPending, cambiarEstado],
  );

  return (
    <PageLayout title="Pedidos" description="Ventas cerradas y estado logístico.">
      {isError && <Alert variant="error">{error.message}</Alert>}
      {actualizarMutation.isError && (
        <Alert variant="error">{actualizarMutation.error.message}</Alert>
      )}

      <AdminFilterBar
        showSearch={false}
        filters={[
          {
            key: 'estadoLogistico',
            label: 'Estado logístico',
            value: estadoLogistico,
            options: [{ value: 'todos', label: 'Todos' }, ...ESTADOS_LOGISTICOS],
          },
        ]}
        onFilterChange={(key, value) => {
          setFilter('page', '1');
          setFilter(key, value);
        }}
        onClear={() => {
          clearFilters();
          setSort({ key: 'createdAt', direction: 'desc' });
        }}
      />

      <DataTable
        columns={columns}
        data={items}
        loading={isLoading}
        emptyMessage="No hay pedidos registrados."
        sort={sort}
        onSort={toggleSort}
      />

      <AdminPagination
        paginacion={data?.paginacion}
        loading={isLoading}
        onPageChange={(p) => setFilter('page', String(p))}
      />
    </PageLayout>
  );
}
