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
import { useProductosAdmin, useDesactivarProductoAdmin, useReactivarProductoAdmin } from '../../../hooks/admin/useProductosAdmin.js';
import { useCategoriasAdmin } from '../../../hooks/admin/useCategoriasAdmin.js';
import { buildAdminListParams } from '../../../utils/admin/buildAdminApiParams.js';
import { formatPrecioArs } from '../../../utils/admin/productoComercial.js';

const FILTER_DEFAULTS = { q: '', estado: 'todos', categoria: '' };

export default function ProductosPage() {
  const navigate = useNavigate();
  const [productoConfirmar, setProductoConfirmar] = useState(null);
  const [sort, setSort] = useState({ key: 'orden', direction: 'asc' });
  const { search, setSearch, getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);

  const estado = getFilter('estado', 'todos');
  const categoria = getFilter('categoria', '');

  const apiParams = useMemo(
    () =>
      buildAdminListParams(
        { search, estado, categoria: categoria || undefined },
        sort,
      ),
    [search, estado, categoria, sort],
  );

  const { data: productos, isLoading, isError, error } = useProductosAdmin(apiParams);
  const { data: categorias } = useCategoriasAdmin({ sort: 'orden', order: 'asc' });
  const desactivarMutation = useDesactivarProductoAdmin();
  const reactivarMutation = useReactivarProductoAdmin();

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key: null, direction: null };
      return { key, direction: 'asc' };
    });
  };

  const opcionesCategorias = useMemo(() => {
    const nombres = new Set((categorias ?? []).map((c) => c.nombre));
    (productos ?? []).forEach((p) => nombres.add(p.categoria));
    return [
      { value: '', label: 'Todas' },
      ...[...nombres].sort((a, b) => a.localeCompare(b, 'es')).map((nombre) => ({
        value: nombre,
        label: nombre,
      })),
    ];
  }, [categorias, productos]);

  const columns = useMemo(
    () => [
      { key: 'id', header: 'ID', sortable: true },
      { key: 'nombre', header: 'Nombre', sortable: true },
      { key: 'categoria', header: 'Categoría', sortable: true },
      {
        key: 'esNuevo',
        header: 'Nuevo',
        render: (row) =>
          row.esNuevo ? <Badge variant="success">Sí</Badge> : <Badge variant="muted">No</Badge>,
      },
      {
        key: 'esDestacado',
        header: 'Destacado',
        render: (row) =>
          row.esDestacado ? <Badge variant="success">Sí</Badge> : <Badge variant="muted">No</Badge>,
      },
      {
        key: 'orden',
        header: 'Orden',
        sortable: true,
        sortValue: (row) => row.orden ?? 0,
        render: (row) => row.orden ?? 0,
      },
      {
        key: 'precioMinorista',
        header: 'P. minorista',
        sortable: false,
        render: (row) => formatPrecioArs(row.precioMinorista),
      },
      {
        key: 'cantidadMinimaMayorista',
        header: 'Mín. mayorista',
        sortable: false,
        render: (row) =>
          row.cantidadMinimaMayorista != null
            ? `≥ ${row.cantidadMinimaMayorista} ${row.unidadStock ?? 'un'}`
            : '—',
      },
      {
        key: 'stockUnidades',
        header: 'Stock',
        sortable: true,
        sortValue: (row) => row.stockUnidades ?? 0,
        render: (row) => `${row.stockUnidades ?? 0} ${row.unidadStock ?? 'un'}`,
      },
      {
        key: 'activoComercial',
        header: 'Comercial',
        sortable: true,
        sortValue: (row) => (row.activoComercial ? 1 : 0),
        render: (row) => (
          <Badge variant={row.activoComercial ? 'success' : 'muted'}>
            {row.activoComercial ? 'Sí' : 'No'}
          </Badge>
        ),
      },
      {
        key: 'activo',
        header: 'Estado',
        sortable: true,
        sortValue: (row) => (row.activo ? 1 : 0),
        render: (row) => (
          <Badge variant={row.activo ? 'success' : 'muted'}>
            {row.activo ? 'Activo' : 'Inactivo'}
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
              label="Editar producto"
              onClick={() => navigate(`/admin/productos/${row.id}/editar`)}
            />
            <AdminActivoActions
              activo={row.activo}
              onDesactivar={() => setProductoConfirmar(row)}
              onReactivar={() => reactivarMutation.mutate(row.id)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const confirmarDesactivar = async () => {
    if (!productoConfirmar) return;
    await desactivarMutation.mutateAsync(productoConfirmar.id);
    setProductoConfirmar(null);
  };

  return (
    <PageLayout
      title="Productos"
      description="Catálogo de pastas frescas publicadas en la landing."
      actions={
        <Link to="/admin/productos/nuevo">
          <Button>Nuevo producto</Button>
        </Link>
      }
    >
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre, categoría o ID…"
        filters={[
          {
            key: 'estado',
            label: 'Estado',
            value: estado,
            options: [
              { value: 'todos', label: 'Todos' },
              { value: 'activo', label: 'Activos' },
              { value: 'inactivo', label: 'Inactivos' },
            ],
          },
          {
            key: 'categoria',
            label: 'Categoría',
            value: categoria,
            options: opcionesCategorias,
          },
        ]}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      {isError && <Alert variant="error">{error.message}</Alert>}

      <DataTable
        columns={columns}
        data={productos}
        loading={isLoading}
        sort={sort}
        onSort={toggleSort}
        emptyMessage="No hay productos que coincidan con los filtros"
      />

      <Modal
        open={Boolean(productoConfirmar)}
        title="Desactivar producto"
        onClose={() => setProductoConfirmar(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setProductoConfirmar(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarDesactivar} disabled={desactivarMutation.isPending}>
              Desactivar
            </Button>
          </>
        }
      >
        <p>
          ¿Desactivar <strong>{productoConfirmar?.nombre}</strong>? Dejará de mostrarse en la landing.
        </p>
      </Modal>
    </PageLayout>
  );
}
