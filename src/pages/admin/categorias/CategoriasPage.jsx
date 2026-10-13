import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { Modal } from '../../../components/admin/ui/Modal.jsx';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { AdminActivoActions } from '../../../components/admin/ui/AdminActivoActions.jsx';
import { AdminIconButton } from '../../../components/admin/ui/AdminIconButton.jsx';
import { useCategoriasAdmin, useDesactivarCategoriaAdmin, useReactivarCategoriaAdmin } from '../../../hooks/admin/useCategoriasAdmin.js';
import { buildAdminListParams } from '../../../utils/admin/buildAdminApiParams.js';

const FILTER_DEFAULTS = { q: '', estado: 'todos' };

export default function CategoriasPage() {
  const navigate = useNavigate();
  const [categoriaConfirmar, setCategoriaConfirmar] = useState(null);
  const [sort, setSort] = useState({ key: 'orden', direction: 'asc' });
  const { search, setSearch, getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);
  const estado = getFilter('estado', 'todos');

  const apiParams = useMemo(
    () => buildAdminListParams({ search, estado }, sort),
    [search, estado, sort],
  );

  const { data: categorias, isLoading, isError, error } = useCategoriasAdmin(apiParams);
  const desactivarMutation = useDesactivarCategoriaAdmin();
  const reactivarMutation = useReactivarCategoriaAdmin();

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key: null, direction: null };
      return { key, direction: 'asc' };
    });
  };

  const columns = useMemo(
    () => [
      { key: 'nombre', header: 'Nombre', sortable: true },
      { key: 'slug', header: 'Slug', sortable: true },
      {
        key: 'orden',
        header: 'Orden',
        sortable: true,
        sortValue: (row) => row.orden ?? 0,
        render: (row) => row.orden ?? 0,
      },
      {
        key: 'activo',
        header: 'Estado',
        sortable: true,
        sortValue: (row) => (row.activo ? 1 : 0),
        render: (row) => (
          <Badge variant={row.activo ? 'success' : 'muted'}>
            {row.activo ? 'Activa' : 'Inactiva'}
          </Badge>
        ),
      },
      {
        key: 'acciones',
        header: 'Acciones',
        render: (row) => (
          <div className="admin-table__actions">
            <AdminIconButton
              icon="edit"
              label="Editar categoría"
              onClick={() => navigate(`/admin/categorias/${row.id}/editar`)}
            />
            <AdminActivoActions
              activo={row.activo}
              onDesactivar={() => setCategoriaConfirmar(row)}
              onReactivar={() => reactivarMutation.mutate(row.id)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const confirmarDesactivar = async () => {
    if (!categoriaConfirmar) return;
    await desactivarMutation.mutateAsync(categoriaConfirmar.id);
    setCategoriaConfirmar(null);
  };

  return (
    <PageLayout
      title="Categorías"
      description="Orden y agrupación de productos en la landing."
      actions={
        <Link to="/admin/categorias/nuevo">
          <Button>Nueva categoría</Button>
        </Link>
      }
    >
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre o slug…"
        filters={[
          {
            key: 'estado',
            label: 'Estado',
            value: estado,
            options: [
              { value: 'todos', label: 'Todas' },
              { value: 'activo', label: 'Activas' },
              { value: 'inactivo', label: 'Inactivas' },
            ],
          },
        ]}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      {isError && <Alert variant="error">{error.message}</Alert>}

      <DataTable
        columns={columns}
        data={categorias}
        loading={isLoading}
        sort={sort}
        onSort={toggleSort}
        emptyMessage="No hay categorías que coincidan con los filtros"
      />

      <Modal
        open={Boolean(categoriaConfirmar)}
        title="Desactivar categoría"
        onClose={() => setCategoriaConfirmar(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCategoriaConfirmar(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarDesactivar} disabled={desactivarMutation.isPending}>
              Desactivar
            </Button>
          </>
        }
      >
        <p>
          ¿Desactivar <strong>{categoriaConfirmar?.nombre}</strong>? Los productos conservan el nombre de categoría.
        </p>
      </Modal>
    </PageLayout>
  );
}
