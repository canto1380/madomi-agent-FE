import { useCallback, useMemo, useState } from 'react';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Input } from '../../../components/admin/ui/Input.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { Modal } from '../../../components/admin/ui/Modal.jsx';
import {
  usePermisos,
  useCrearPermiso,
  useActualizarPermiso,
  useEliminarPermiso,
} from '../../../hooks/admin/usePermisos.js';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { useTableSort } from '../../../hooks/admin/useTableSort.js';
import { filterRows } from '../../../utils/admin/filterRows.js';

const FILTER_DEFAULTS = { q: '' };

export default function PermisosPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [permisoEditar, setPermisoEditar] = useState(null);
  const [permisoEliminar, setPermisoEliminar] = useState(null);
  const [form, setForm] = useState({ codigo: '', descripcion: '' });
  const [errorForm, setErrorForm] = useState('');

  const { search, setSearch, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);
  const { data: permisos, isLoading, isError, error } = usePermisos();
  const crearMutation = useCrearPermiso();
  const actualizarMutation = useActualizarPermiso();
  const eliminarMutation = useEliminarPermiso();

  const abrirEditar = useCallback((permiso) => {
    setPermisoEditar(permiso);
    setForm({ codigo: permiso.codigo, descripcion: permiso.descripcion ?? '' });
    setErrorForm('');
    setModalAbierto(true);
  }, []);

  const columns = useMemo(
    () => [
      { key: 'codigo', header: 'Código', sortable: true },
      {
        key: 'descripcion',
        header: 'Descripción',
        sortable: true,
        sortValue: (row) => row.descripcion ?? '',
        render: (row) => row.descripcion || '—',
      },
      {
        key: 'acciones',
        header: 'Acciones',
        render: (row) => (
          <div className="admin-table__actions">
            <Button variant="secondary" size="sm" onClick={() => abrirEditar(row)}>
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => setPermisoEliminar(row)}>
              Eliminar
            </Button>
          </div>
        ),
      },
    ],
    [abrirEditar],
  );

  const filteredRows = useMemo(
    () =>
      filterRows(permisos ?? [], {
        search,
        searchKeys: ['codigo', 'descripcion'],
      }),
    [permisos, search],
  );

  const { sortedData, sort, toggleSort } = useTableSort(filteredRows, columns, {
    key: 'codigo',
    direction: 'asc',
  });

  const abrirCrear = () => {
    setPermisoEditar(null);
    setForm({ codigo: '', descripcion: '' });
    setErrorForm('');
    setModalAbierto(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setErrorForm('');
    try {
      const payload = {
        codigo: form.codigo,
        descripcion: form.descripcion || null,
      };
      if (permisoEditar) {
        await actualizarMutation.mutateAsync({ id: permisoEditar.id, payload });
      } else {
        await crearMutation.mutateAsync(payload);
      }
      setModalAbierto(false);
    } catch (err) {
      setErrorForm(err.message);
    }
  };

  const confirmarEliminar = async () => {
    if (!permisoEliminar) return;
    try {
      await eliminarMutation.mutateAsync(permisoEliminar.id);
      setPermisoEliminar(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <PageLayout
      title="Permisos"
      description="Catálogo de permisos del sistema"
      actions={<Button onClick={abrirCrear}>Nuevo permiso</Button>}
    >
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por código o descripción…"
        onClear={clearFilters}
      />

      {isError && <Alert variant="error">{error.message}</Alert>}

      <DataTable
        columns={columns}
        data={sortedData}
        loading={isLoading}
        sort={sort}
        onSort={toggleSort}
        emptyMessage="No hay permisos que coincidan con los filtros"
      />

      <Modal
        open={modalAbierto}
        title={permisoEditar ? 'Editar permiso' : 'Nuevo permiso'}
        onClose={() => setModalAbierto(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button
              onClick={guardar}
              disabled={crearMutation.isPending || actualizarMutation.isPending}
            >
              Guardar
            </Button>
          </>
        }
      >
        {errorForm && <Alert variant="error">{errorForm}</Alert>}
        <form className="admin-form admin-form--compact" onSubmit={guardar}>
          <Input
            label="Código"
            name="codigo"
            value={form.codigo}
            onChange={(e) => setForm((p) => ({ ...p, codigo: e.target.value }))}
            placeholder="usuarios.crear"
            required
          />
          <Input
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
          />
        </form>
      </Modal>

      <Modal
        open={Boolean(permisoEliminar)}
        title="Eliminar permiso"
        onClose={() => setPermisoEliminar(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPermisoEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarEliminar} disabled={eliminarMutation.isPending}>
              Eliminar
            </Button>
          </>
        }
      >
        <p>
          ¿Eliminar el permiso <strong>{permisoEliminar?.codigo}</strong>? Solo es posible si no
          está asignado a ningún rol.
        </p>
      </Modal>
    </PageLayout>
  );
}
