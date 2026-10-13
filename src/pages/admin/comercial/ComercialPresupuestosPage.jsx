import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { AdminPagination } from '../../../components/admin/ui/AdminPagination.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { useCrmPresupuestosAdmin } from '../../../hooks/admin/useCrmAdmin.js';
import { buildCrmListParams } from '../../../utils/admin/buildCrmListParams.js';
import { ESTADOS_PRESUPUESTO, etiquetaEstadoPresupuesto, formatearFecha } from '../../../utils/admin/crmCatalog.js';

const FILTER_DEFAULTS = { estadoPresupuesto: 'todos', page: '1' };

export default function ComercialPresupuestosPage() {
  const [sort, setSort] = useState({ key: 'createdAt', direction: 'desc' });
  const { getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);

  const estadoPresupuesto = getFilter('estadoPresupuesto', 'todos');
  const page = Math.max(1, Number(getFilter('page', '1')) || 1);

  const apiParams = useMemo(
    () =>
      buildCrmListParams({
        filters: { estadoPresupuesto },
        sort,
        page,
        limit: 20,
      }),
    [estadoPresupuesto, sort, page],
  );

  const { data, isLoading, isError, error } = useCrmPresupuestosAdmin(apiParams);
  const items = data?.items ?? [];

  const toggleSort = (key) => {
    setFilter('page', '1');
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key, direction: 'asc' };
      return { key: 'createdAt', direction: 'desc' };
    });
  };

  const columns = useMemo(
    () => [
      {
        key: 'createdAt',
        header: 'Fecha',
        sortable: true,
        render: (row) => formatearFecha(row.createdAt),
      },
      {
        key: 'estado',
        header: 'Estado',
        sortable: true,
        render: (row) => <Badge variant="default">{etiquetaEstadoPresupuesto(row.estado)}</Badge>,
      },
      {
        key: 'total',
        header: 'Total',
        sortable: true,
        render: (row) =>
          row.total != null ? `${row.moneda ?? 'ARS'} ${Number(row.total).toLocaleString('es-AR')}` : '—',
      },
      {
        key: 'validezHasta',
        header: 'Válido hasta',
        render: (row) => formatearFecha(row.validezHasta),
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
      {
        key: 'pdf',
        header: 'PDF',
        render: (row) =>
          row.pdfUrl ? (
            <a href={row.pdfUrl} target="_blank" rel="noreferrer" className="adminLink">
              Abrir
            </a>
          ) : (
            '—'
          ),
      },
    ],
    [],
  );

  return (
    <PageLayout title="Presupuestos" description="Cotizaciones generadas por el asistente.">
      {isError && <Alert variant="error">{error.message}</Alert>}

      <AdminFilterBar
        showSearch={false}
        filters={[
          {
            key: 'estadoPresupuesto',
            label: 'Estado',
            value: estadoPresupuesto,
            options: [{ value: 'todos', label: 'Todos' }, ...ESTADOS_PRESUPUESTO],
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
        emptyMessage="No hay presupuestos."
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
