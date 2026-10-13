import { useCallback, useMemo, useState } from 'react';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Input } from '../../../components/admin/ui/Input.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { AdminFilterBar } from '../../../components/admin/ui/AdminFilterBar.jsx';
import { Modal } from '../../../components/admin/ui/Modal.jsx';
import { AdminIconButton } from '../../../components/admin/ui/AdminIconButton.jsx';
import { useAdminListFilters } from '../../../hooks/admin/useAdminListFilters.js';
import { AdminActivoActions } from '../../../components/admin/ui/AdminActivoActions.jsx';
import {
  useContenidoAdmin,
  useActualizarContenidoAdmin,
  useDesactivarContenidoAdmin,
  useReactivarContenidoAdmin,
} from '../../../hooks/admin/useContenidoAdmin.js';
import { buildAdminListParams } from '../../../utils/admin/buildAdminApiParams.js';
import {
  getTextoUbicacion,
  SECCIONES_TEXTO,
} from '../../../utils/admin/contentCatalog.js';

const FILTER_DEFAULTS = { q: '', estado: 'todos', seccion: '' };

export default function TextosPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditar, setItemEditar] = useState(null);
  const [itemConfirmar, setItemConfirmar] = useState(null);
  const [form, setForm] = useState({
    clave: '',
    valor: '',
    seccion: 'general',
    tipo: 'texto',
    orden: 0,
    activo: true,
  });
  const [errorForm, setErrorForm] = useState('');
  const [sort, setSort] = useState({ key: 'clave', direction: 'asc' });

  const { search, setSearch, getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);
  const estado = getFilter('estado', 'todos');
  const seccion = getFilter('seccion', '');

  const apiParams = useMemo(
    () =>
      buildAdminListParams(
        { search, estado, seccion: seccion || undefined },
        sort,
      ),
    [search, estado, seccion, sort],
  );

  const { data: textos, isLoading, isError, error } = useContenidoAdmin(apiParams);
  const actualizarMutation = useActualizarContenidoAdmin();
  const desactivarMutation = useDesactivarContenidoAdmin();
  const reactivarMutation = useReactivarContenidoAdmin();

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key: null, direction: null };
      return { key, direction: 'asc' };
    });
  };

  const abrirEditar = useCallback((item) => {
    setItemEditar(item);
    setForm({
      clave: item.clave,
      valor: item.valor,
      seccion: item.seccion,
      tipo: item.tipo ?? 'texto',
      orden: item.orden ?? 0,
      activo: item.activo,
    });
    setErrorForm('');
    setModalAbierto(true);
  }, []);

  const columns = useMemo(
    () => [
      { key: 'clave', header: 'Clave', sortable: true },
      {
        key: 'ubicacion',
        header: 'Dónde se muestra',
        render: (row) => (
          <span className="adminCatalogUbicacion">
            {getTextoUbicacion(row.clave) ?? '—'}
          </span>
        ),
      },
      {
        key: 'valor',
        header: 'Valor',
        sortable: true,
        render: (row) => (
          <span className="admin-cellTruncate" title={row.valor}>
            {row.valor}
          </span>
        ),
      },
      { key: 'seccion', header: 'Sección', sortable: true },
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
            <AdminIconButton icon="edit" label="Editar texto" onClick={() => abrirEditar(row)} />
            <AdminActivoActions
              activo={row.activo}
              onDesactivar={() => setItemConfirmar(row)}
              onReactivar={() => reactivarMutation.mutate(row.id)}
            />
          </div>
        ),
      },
    ],
    [abrirEditar, reactivarMutation],
  );

  const guardar = async (e) => {
    e.preventDefault();
    setErrorForm('');
    if (!itemEditar) return;

    try {
      const payload = {
        valor: form.valor.trim(),
        orden: Number(form.orden) || 0,
        activo: form.activo,
      };
      await actualizarMutation.mutateAsync({ id: itemEditar.id, payload });
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

  const opcionesSeccion = [
    { value: '', label: 'Todas' },
    ...SECCIONES_TEXTO.map((s) => ({ value: s, label: s })),
  ];

  const ubicacionForm = getTextoUbicacion(form.clave);

  return (
    <PageLayout
      title="Textos"
      description="Editá los textos de la landing. La clave no se modifica: define dónde aparece cada bloque."
    >
      <p className="adminCatalogHint">
        Cada fila indica en qué parte del sitio se muestra. Solo podés editar el valor, el orden y el estado.
      </p>

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por clave, valor o sección…"
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
            key: 'seccion',
            label: 'Sección',
            value: seccion,
            options: opcionesSeccion,
          },
        ]}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      {isError && <Alert variant="error">{error.message}</Alert>}

      <DataTable
        columns={columns}
        data={textos}
        loading={isLoading}
        sort={sort}
        onSort={toggleSort}
        emptyMessage="No hay textos que coincidan con los filtros"
      />

      <Modal
        open={modalAbierto}
        title="Editar texto"
        onClose={() => setModalAbierto(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={actualizarMutation.isPending}>
              Guardar
            </Button>
          </>
        }
      >
        {errorForm && <Alert variant="error">{errorForm}</Alert>}
        <form className="admin-form admin-form--compact" onSubmit={guardar}>
          <Input label="Clave" name="clave" value={form.clave} disabled readOnly />
          {ubicacionForm && (
            <p className="adminCatalogUbicacion adminCatalogUbicacion--form">
              <strong>Dónde se muestra:</strong> {ubicacionForm}
            </p>
          )}
          <Input
            label="Valor"
            name="valor"
            value={form.valor}
            onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))}
            required
          />
          <Input label="Sección" name="seccion" value={form.seccion} disabled readOnly />
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
            Activo
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(itemConfirmar)}
        title="Desactivar texto"
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
          ¿Desactivar la clave <strong>{itemConfirmar?.clave}</strong>?
        </p>
      </Modal>
    </PageLayout>
  );
}
