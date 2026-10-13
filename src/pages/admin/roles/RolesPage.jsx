import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { Modal } from '../../../components/admin/ui/Modal.jsx';
import { useRoles, useEliminarRol } from '../../../hooks/admin/useRoles.js';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { useTableSort } from '../../../hooks/admin/useTableSort.js';
import { filterRows } from '../../../utils/admin/filterRows.js';

const FILTER_DEFAULTS = { q: '' };

export default function RolesPage() {
  const [rolEliminar, setRolEliminar] = useState(null);
  const { search, setSearch, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);
  const { data: roles, isLoading, isError, error } = useRoles();
  const eliminarMutation = useEliminarRol();

  const columns = useMemo(
    () => [
      { key: 'nombre', header: 'Nombre', sortable: true },
      {
        key: 'descripcion',
        header: 'Descripción',
        sortable: true,
        sortValue: (row) => row.descripcion ?? '',
        render: (row) => row.descripcion || '—',
      },
      {
        key: 'permisos',
        header: 'Permisos',
        sortable: true,
        sortValue: (row) => row.permisos?.length ?? 0,
        render: (row) => row.permisos?.length ?? 0,
      },
      {
        key: 'usuarios',
        header: 'Usuarios',
        sortable: true,
        sortValue: (row) => row._count?.usuarios ?? 0,
        render: (row) => row._count?.usuarios ?? 0,
      },
      {
        key: 'acciones',
        header: 'Acciones',
        render: (row) => (
          <div className="admin-table__actions">
            <Link to={`/admin/roles/${row.id}/editar`}>
              <Button variant="secondary" size="sm">
                Editar
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={() => setRolEliminar(row)}>
              Eliminar
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const filteredRows = useMemo(
    () =>
      filterRows(roles ?? [], {
        search,
        searchKeys: ['nombre', 'descripcion'],
      }),
    [roles, search],
  );

  const { sortedData, sort, toggleSort } = useTableSort(filteredRows, columns, {
    key: 'nombre',
    direction: 'asc',
  });

  const confirmarEliminar = async () => {
    if (!rolEliminar) return;
    try {
      await eliminarMutation.mutateAsync(rolEliminar.id);
      setRolEliminar(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <PageLayout
      title="Roles"
      description="Gestión de roles y asignación de permisos"
      actions={
        <Link to="/admin/roles/nuevo">
          <Button>Nuevo rol</Button>
        </Link>
      }
    >
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre o descripción…"
        onClear={clearFilters}
      />

      {isError && <Alert variant="error">{error.message}</Alert>}

      <DataTable
        columns={columns}
        data={sortedData}
        loading={isLoading}
        sort={sort}
        onSort={toggleSort}
        emptyMessage="No hay roles que coincidan con los filtros"
      />

      <Modal
        open={Boolean(rolEliminar)}
        title="Eliminar rol"
        onClose={() => setRolEliminar(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRolEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarEliminar} disabled={eliminarMutation.isPending}>
              Eliminar
            </Button>
          </>
        }
      >
        <p>
          ¿Eliminar el rol <strong>{rolEliminar?.nombre}</strong>? Solo es posible si no tiene
          usuarios asignados.
        </p>
      </Modal>
    </PageLayout>
  );
}
