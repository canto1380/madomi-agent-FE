import { useCallback, useMemo, useState } from 'react';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Input } from '../../../components/admin/ui/Input.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { Modal } from '../../../components/admin/ui/Modal.jsx';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { AdminActivoActions } from '../../../components/admin/ui/AdminActivoActions.jsx';
import { AdminIconButton } from '../../../components/admin/ui/AdminIconButton.jsx';
import {
  useRedesAdmin,
  useCrearRedAdmin,
  useActualizarRedAdmin,
  useDesactivarRedAdmin,
  useReactivarRedAdmin,
} from '../../../hooks/admin/useRedesAdmin.js';
import { buildAdminListParams } from '../../../utils/admin/buildAdminApiParams.js';

const FILTER_DEFAULTS = { q: '', estado: 'todos' };

export default function RedesPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditar, setItemEditar] = useState(null);
  const [itemConfirmar, setItemConfirmar] = useState(null);
  const [form, setForm] = useState({ plataforma: '', url: '', orden: 0, activo: true });
  const [errorForm, setErrorForm] = useState('');
  const [sort, setSort] = useState({ key: 'orden', direction: 'asc' });

  const { search, setSearch, getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);
  const estado = getFilter('estado', 'todos');

  const apiParams = useMemo(
    () => buildAdminListParams({ search, estado }, sort),
    [search, estado, sort],
  );

  const { data: redes, isLoading, isError, error } = useRedesAdmin(apiParams);
  const crearMutation = useCrearRedAdmin();
  const actualizarMutation = useActualizarRedAdmin();
  const desactivarMutation = useDesactivarRedAdmin();
  const reactivarMutation = useReactivarRedAdmin();

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key: null, direction: null };
      return { key, direction: 'asc' };
    });
  };

  const abrirCrear = () => {
    setItemEditar(null);
    setForm({ plataforma: '', url: '', orden: 0, activo: true });
    setErrorForm('');
    setModalAbierto(true);
  };

  const abrirEditar = useCallback((item) => {
    setItemEditar(item);
    setForm({
      plataforma: item.plataforma,
      url: item.url,
      orden: item.orden ?? 0,
      activo: item.activo,
    });
    setErrorForm('');
    setModalAbierto(true);
  }, []);

  const columns = useMemo(
    () => [
      { key: 'plataforma', header: 'Plataforma', sortable: true },
      {
        key: 'url',
        header: 'URL',
        sortable: true,
        render: (row) => (
          <a href={row.url} target="_blank" rel="noreferrer" className="admin-cellLink">
            {row.url}
          </a>
        ),
      },
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
            <AdminIconButton icon="edit" label="Editar red social" onClick={() => abrirEditar(row)} />
            <AdminActivoActions
              activo={row.activo}
              onDesactivar={() => setItemConfirmar(row)}
              onReactivar={() => reactivarMutation.mutate(row.id)}
            />
          </div>
        ),
      },
    ],
    [abrirEditar],
  );

  const guardar = async (e) => {
    e.preventDefault();
    setErrorForm('');
    try {
      const payload = {
        plataforma: form.plataforma.trim(),
        url: form.url.trim(),
        orden: Number(form.orden) || 0,
        activo: form.activo,
      };
      if (itemEditar) {
        await actualizarMutation.mutateAsync({ id: itemEditar.id, payload });
      } else {
        await crearMutation.mutateAsync(payload);
      }
      setModalAbierto(false);
    } catch (err) {
      setErrorForm(err.message);
    }
  };

  const confirmarDesactivar = async () => {
    if (!itemConfirmar) return;
    await desactivarMutation.mutateAsync(itemConfirmar.id);
    setItemConfirmar(null);
  };

  return (
    <PageLayout
      title="Redes sociales"
      description="Enlaces visibles en header y footer de la landing."
      actions={<Button onClick={abrirCrear}>Nueva red</Button>}
    >
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por plataforma o URL…"
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
        data={redes}
        loading={isLoading}
        sort={sort}
        onSort={toggleSort}
        emptyMessage="No hay redes que coincidan con los filtros"
      />

      <Modal
        open={modalAbierto}
        title={itemEditar ? 'Editar red social' : 'Nueva red social'}
        onClose={() => setModalAbierto(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={crearMutation.isPending || actualizarMutation.isPending}>
              Guardar
            </Button>
          </>
        }
      >
        {errorForm && <Alert variant="error">{errorForm}</Alert>}
        <form className="admin-form admin-form--compact" onSubmit={guardar}>
          <Input
            label="Plataforma"
            name="plataforma"
            value={form.plataforma}
            onChange={(e) => setForm((p) => ({ ...p, plataforma: e.target.value }))}
            placeholder="Instagram"
            required
          />
          <Input
            label="URL"
            name="url"
            type="url"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://instagram.com/..."
            required
          />
          <Input
            label="Orden"
            name="orden"
            type="number"
            value={form.orden}
            onChange={(e) => setForm((p) => ({ ...p, orden: Number(e.target.value) }))}
          />
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((p) => ({ ...p, activo: e.target.checked }))}
            />
            Activa
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(itemConfirmar)}
        title="Desactivar red social"
        onClose={() => setItemConfirmar(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setItemConfirmar(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarDesactivar} disabled={desactivarMutation.isPending}>
              Desactivar
            </Button>
          </>
        }
      >
        <p>
          ¿Desactivar <strong>{itemConfirmar?.plataforma}</strong>?
        </p>
      </Modal>
    </PageLayout>
  );
}
