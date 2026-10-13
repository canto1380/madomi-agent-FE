import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { Modal } from '../../../components/admin/ui/Modal.jsx';
import {
  useUsuarios,
  useEliminarUsuario,
  useReactivarUsuario,
} from '../../../hooks/admin/useUsuarios.js';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { useTableSort } from '../../../hooks/admin/useTableSort.js';
import { filterRows } from '../../../utils/admin/filterRows.js';

const FILTER_DEFAULTS = { q: '', estado: 'todos' };

export default function UsuariosPage() {
  const [usuarioConfirmar, setUsuarioConfirmar] = useState(null);
  const { search, setSearch, getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);
  const estado = getFilter('estado', 'todos');

  const { data: usuarios, isLoading, isError, error } = useUsuarios({
    incluirInactivos: estado === 'activo' ? 'false' : 'true',
  });
  const eliminarMutation = useEliminarUsuario();
  const reactivarMutation = useReactivarUsuario();

  const columns = useMemo(
    () => [
      {
        key: 'nombre',
        header: 'Nombre',
        sortable: true,
        sortValue: (row) => `${row.nombre} ${row.apellido}`,
        render: (row) => `${row.nombre} ${row.apellido}`,
      },
      { key: 'email', header: 'Email', sortable: true },
      {
        key: 'rol',
        header: 'Rol',
        sortable: true,
        sortValue: (row) => row.rol?.nombre ?? '',
        render: (row) => row.rol?.nombre ?? '—',
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
            <Link to={`/admin/usuarios/${row.id}/editar`}>
              <Button variant="secondary" size="sm">
                Editar
              </Button>
            </Link>
            {row.activo ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  setUsuarioConfirmar({ id: row.id, accion: 'desactivar', email: row.email })
                }
              >
                Desactivar
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setUsuarioConfirmar({ id: row.id, accion: 'reactivar', email: row.email })
                }
              >
                Reactivar
              </Button>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const filteredRows = useMemo(
    () =>
      filterRows(usuarios ?? [], {
        search,
        searchKeys: [(row) => `${row.nombre} ${row.apellido}`, 'email', (row) => row.rol?.nombre],
        filters: { estado },
      }),
    [usuarios, search, estado],
  );

  const { sortedData, sort, toggleSort } = useTableSort(filteredRows, columns, {
    key: 'nombre',
    direction: 'asc',
  });

  const confirmarAccion = async () => {
    if (!usuarioConfirmar) return;
    if (usuarioConfirmar.accion === 'desactivar') {
      await eliminarMutation.mutateAsync(usuarioConfirmar.id);
    } else {
      await reactivarMutation.mutateAsync(usuarioConfirmar.id);
    }
    setUsuarioConfirmar(null);
  };

  return (
    <PageLayout
      title="Usuarios"
      description="Administración de cuentas de usuario del sistema"
      actions={
        <Link to="/admin/usuarios/nuevo">
          <Button>Nuevo usuario</Button>
        </Link>
      }
    >
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre, email o rol…"
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
        ]}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      {isError && <Alert variant="error">{error.message}</Alert>}

      <DataTable
        columns={columns}
        data={sortedData}
        loading={isLoading}
        sort={sort}
        onSort={toggleSort}
        emptyMessage="No hay usuarios que coincidan con los filtros"
      />

      <Modal
        open={Boolean(usuarioConfirmar)}
        title={usuarioConfirmar?.accion === 'desactivar' ? 'Desactivar usuario' : 'Reactivar usuario'}
        onClose={() => setUsuarioConfirmar(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setUsuarioConfirmar(null)}>
              Cancelar
            </Button>
            <Button
              variant={usuarioConfirmar?.accion === 'desactivar' ? 'danger' : 'primary'}
              onClick={confirmarAccion}
              disabled={eliminarMutation.isPending || reactivarMutation.isPending}
            >
              Confirmar
            </Button>
          </>
        }
      >
        {usuarioConfirmar?.accion === 'desactivar' ? (
          <p>
            ¿Desactivar al usuario <strong>{usuarioConfirmar.email}</strong>? No podrá acceder al
            sistema.
          </p>
        ) : (
          <p>
            ¿Reactivar al usuario <strong>{usuarioConfirmar?.email}</strong>?
          </p>
        )}
      </Modal>
    </PageLayout>
  );
}
