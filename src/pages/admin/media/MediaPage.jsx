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
  useMediaAdmin,
  useActualizarMediaAdmin,
  useDesactivarMediaAdmin,
  useReactivarMediaAdmin,
  useSubirArchivoMediaAdmin,
} from '../../../hooks/admin/useMediaAdmin.js';
import { notificarAdmin } from '../../../utils/admin/notificarAdmin.js';
import { buildAdminListParams } from '../../../utils/admin/buildAdminApiParams.js';
import { inferirCarpetaStorage } from '../../../utils/admin/storageFolders.js';
import { getMediaUbicacion } from '../../../utils/admin/contentCatalog.js';

const FILTER_DEFAULTS = { q: '', estado: 'todos', tipo: '' };

const TIPOS_MEDIA = [
  { value: '', label: 'Todos' },
  { value: 'imagen', label: 'Imagen' },
  { value: 'video', label: 'Video' },
  { value: 'otro', label: 'Otro' },
];

export default function MediaPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditar, setItemEditar] = useState(null);
  const [itemConfirmar, setItemConfirmar] = useState(null);
  const [form, setForm] = useState({
    clave: '',
    tipo: 'imagen',
    url: '',
    alt: '',
    orden: 0,
    activo: true,
    carpeta: '',
  });
  const [errorForm, setErrorForm] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [sort, setSort] = useState({ key: 'orden', direction: 'asc' });

  const { search, setSearch, getFilter, setFilter, clearFilters } = useAdminListFilters(FILTER_DEFAULTS);
  const estado = getFilter('estado', 'todos');
  const tipo = getFilter('tipo', '');

  const apiParams = useMemo(
    () =>
      buildAdminListParams(
        { search, estado, tipo: tipo || undefined },
        sort,
      ),
    [search, estado, tipo, sort],
  );

  const { data: media, isLoading, isError, error } = useMediaAdmin(apiParams);
  const actualizarMutation = useActualizarMediaAdmin();
  const desactivarMutation = useDesactivarMediaAdmin();
  const reactivarMutation = useReactivarMediaAdmin();
  const subirMutation = useSubirArchivoMediaAdmin();

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
      tipo: item.tipo,
      url: item.url,
      alt: item.alt ?? '',
      orden: item.orden ?? 0,
      activo: item.activo,
      carpeta: '',
    });
    setArchivo(null);
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
            {getMediaUbicacion(row.clave) ?? '—'}
          </span>
        ),
      },
      { key: 'tipo', header: 'Tipo', sortable: true },
      {
        key: 'url',
        header: 'URL',
        sortable: true,
        render: (row) => (
          <span className="admin-cellTruncate" title={row.url}>
            {row.url}
          </span>
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
            <AdminIconButton icon="edit" label="Editar media" onClick={() => abrirEditar(row)} />
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
      let url = form.url.trim();
      let tipoAsset = form.tipo;

      if (archivo) {
        const upload = await subirMutation.mutateAsync({
          file: archivo,
          clave: form.clave.trim(),
          carpeta: form.carpeta || undefined,
          modulo: 'media',
          previousUrl: itemEditar?.url,
        });
        url = upload.url;
        tipoAsset = upload.tipo;
      }

      if (!url) {
        const mensaje = 'Subí un archivo o ingresá una URL';
        setErrorForm(mensaje);
        notificarAdmin({ type: 'error', message: mensaje });
        return;
      }

      const payload = {
        tipo: tipoAsset,
        url,
        alt: form.alt.trim() || null,
        orden: Number(form.orden) || 0,
        activo: form.activo,
      };

      await actualizarMutation.mutateAsync({ id: itemEditar.id, payload });
      setModalAbierto(false);
      setArchivo(null);
    } catch (err) {
      setErrorForm(err.message);
    }
  };

  const confirmarDesactivar = async () => {
    if (!itemConfirmar) return;
    await desactivarMutation.mutateAsync(itemConfirmar.id);
    setItemConfirmar(null);
  };

  const ubicacionForm = getMediaUbicacion(form.clave);
  const carpetaInferida = form.carpeta || inferirCarpetaStorage(form.clave);

  return (
    <PageLayout
      title="Media"
      description="Imágenes y videos en Supabase. La clave no se modifica: define dónde aparece cada archivo."
    >
      <p className="adminCatalogHint">
        Cada asset indica en qué parte del sitio se usa. Subí archivos o editá URL, alt y estado.
      </p>

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por clave, URL o alt…"
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
            key: 'tipo',
            label: 'Tipo',
            value: tipo,
            options: TIPOS_MEDIA,
          },
        ]}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      {isError && <Alert variant="error">{error.message}</Alert>}

      <DataTable
        columns={columns}
        data={media}
        loading={isLoading}
        sort={sort}
        onSort={toggleSort}
        emptyMessage="No hay assets que coincidan con los filtros"
      />

      <Modal
        open={modalAbierto}
        title="Editar media"
        onClose={() => setModalAbierto(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button
              onClick={guardar}
              disabled={actualizarMutation.isPending || subirMutation.isPending}
            >
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
          <span className="admin-field__hint">
            Carpeta en Supabase: <strong>{carpetaInferida}</strong>
          </span>
          <Input label="Tipo" name="tipo" value={form.tipo} disabled readOnly />
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="media-archivo">
              Archivo (imagen o video)
            </label>
            <input
              id="media-archivo"
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              className="admin-field__input"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            />
            <span className="admin-field__hint">Las imágenes se guardan como WebP en Supabase.</span>
          </div>
          {form.url && form.tipo === 'imagen' && (
            <img src={form.url} alt={form.alt || form.clave} className="adminMediaPreview" />
          )}
          <Input
            label="URL (manual o tras subir archivo)"
            name="url"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://..."
          />
          <Input
            label="Alt"
            name="alt"
            value={form.alt}
            onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))}
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
            Activo
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(itemConfirmar)}
        title="Desactivar asset"
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
          ¿Desactivar <strong>{itemConfirmar?.clave}</strong>?
        </p>
      </Modal>
    </PageLayout>
  );
}
