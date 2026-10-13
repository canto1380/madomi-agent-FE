import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { AdminPagination } from '../../../components/admin/ui/AdminPagination.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { useCrmLeadsAdmin } from '../../../hooks/admin/useCrmAdmin.js';
import { buildCrmListParams } from '../../../utils/admin/buildCrmListParams.js';
import { ESTADOS_LEAD, formatearFecha, nombreCliente } from '../../../utils/admin/crmCatalog.js';
import { LeadEstadoBadge } from '../../../components/admin/comercial/LeadEstadoBadge.jsx';

const FILTER_DEFAULTS = { q: '', estado: 'todos', telefono: '', localidad: '', page: '1' };

export default function ComercialLeadsPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState({ key: 'updatedAt', direction: 'desc' });
  const { search, setSearch, getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);

  const estado = getFilter('estado', 'todos');
  const telefono = getFilter('telefono', '');
  const localidad = getFilter('localidad', '');
  const page = Math.max(1, Number(getFilter('page', '1')) || 1);

  const apiParams = useMemo(
    () =>
      buildCrmListParams({
        filters: {
          nombre: search,
          telefono,
          localidad,
          estado,
        },
        sort,
        page,
        limit: 20,
      }),
    [search, telefono, localidad, estado, sort, page],
  );

  const { data, isLoading, isError, error } = useCrmLeadsAdmin(apiParams);
  const items = data?.items ?? [];
  const paginacion = data?.paginacion;

  const toggleSort = (key) => {
    setFilter('page', '1');
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key: null, direction: null };
      return { key, direction: 'desc' };
    });
  };

  const columns = useMemo(
    () => [
      {
        key: 'cliente',
        header: 'Cliente',
        render: (row) => nombreCliente(row.cliente),
      },
      {
        key: 'telefono',
        header: 'Teléfono',
        render: (row) => row.cliente?.telefono ?? row.cliente?.telefonoNormalizado ?? '—',
      },
      {
        key: 'localidad',
        header: 'Localidad',
        sortable: true,
        render: (row) => row.localidad ?? row.cliente?.localidad ?? '—',
      },
      {
        key: 'estado',
        header: 'Estado',
        sortable: true,
        render: (row) => <LeadEstadoBadge estado={row.estado} />,
      },
      {
        key: 'contacto',
        header: 'Contactar',
        render: (row) =>
          row.requiereContactoComercial ? (
            <span className="crmBadge crmBadge--alert" title={row.seguimientoComercial?.notas ?? ''}>
              Sí
              {row.seguimientoComercial?.preferenciaCanal
                ? ` · ${row.seguimientoComercial.preferenciaCanal}`
                : ''}
            </span>
          ) : (
            '—'
          ),
      },
      {
        key: 'ultimoMensajeAt',
        header: 'Último mensaje',
        sortable: true,
        render: (row) => formatearFecha(row.ultimoMensajeAt ?? row.updatedAt),
      },
      {
        key: 'acciones',
        header: '',
        render: (row) => (
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate(`/admin/comercial/leads/${row.id}`)}>
            Ver
          </Button>
        ),
      },
    ],
    [navigate],
  );

  return (
    <PageLayout title="Leads" description="Prospectos y consultas del asistente.">
      {isError && <Alert variant="error">{error.message}</Alert>}

      <AdminFilterBar
        search={search}
        onSearchChange={(v) => {
          setFilter('page', '1');
          setSearch(v);
        }}
        searchPlaceholder="Buscar por nombre…"
        filters={[
          {
            key: 'estado',
            label: 'Estado',
            value: estado,
            options: [{ value: 'todos', label: 'Todos' }, ...ESTADOS_LEAD],
          },
        ]}
        onFilterChange={(key, value) => {
          setFilter('page', '1');
          setFilter(key, value);
        }}
        onClear={() => {
          clearFilters();
          setSort({ key: 'updatedAt', direction: 'desc' });
        }}
      />

      <div className="adminFilterBar adminFilterBar--inlineExtra">
        <div className="adminFilterBar__filter">
          <label className="adminFilterBar__label" htmlFor="crm-lead-telefono">
            Teléfono
          </label>
          <input
            id="crm-lead-telefono"
            type="search"
            className="adminFilterBar__input"
            value={telefono}
            onChange={(e) => {
              setFilter('page', '1');
              setFilter('telefono', e.target.value);
            }}
          />
        </div>
        <div className="adminFilterBar__filter">
          <label className="adminFilterBar__label" htmlFor="crm-lead-localidad">
            Localidad
          </label>
          <input
            id="crm-lead-localidad"
            type="search"
            className="adminFilterBar__input"
            value={localidad}
            onChange={(e) => {
              setFilter('page', '1');
              setFilter('localidad', e.target.value);
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={isLoading}
        emptyMessage="No hay leads con esos filtros."
        sort={sort}
        onSort={toggleSort}
      />

      <AdminPagination
        paginacion={paginacion}
        loading={isLoading}
        onPageChange={(p) => setFilter('page', String(p))}
      />
    </PageLayout>
  );
}
