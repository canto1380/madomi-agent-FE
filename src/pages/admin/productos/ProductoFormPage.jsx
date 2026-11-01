import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Input } from '../../../components/admin/ui/Input.jsx';
import { Select } from '../../../components/admin/ui/Select.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import {
  useProductoAdmin,
  useCrearProductoAdmin,
  useActualizarProductoAdmin,
  useSubirImagenProductoAdmin,
} from '../../../hooks/admin/useProductosAdmin.js';
import { notificarErroresCliente } from '../../../utils/admin/notificarAdmin.js';
import { useCategoriasAdmin } from '../../../hooks/admin/useCategoriasAdmin.js';
import {
  UNIDADES_STOCK,
  buildPayloadComercial,
  comercialDesdeProducto,
  estadoInicialComercial,
  validarComercial,
} from '../../../utils/admin/productoComercial.js';

const estadoInicial = {
  id: '',
  nombre: '',
  categoria: '',
  descripcion: '',
  imagenUrl: '',
  orden: 0,
  activo: true,
  esNuevo: false,
  esDestacado: false,
  ...estadoInicialComercial(),
};

export default function ProductoFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(estadoInicial);
  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');

  const { data: producto, isLoading: cargandoProducto } = useProductoAdmin(id);
  const { data: categorias, isLoading: cargandoCategorias } = useCategoriasAdmin({
    sort: 'orden',
    order: 'asc',
  });
  const crearMutation = useCrearProductoAdmin();
  const actualizarMutation = useActualizarProductoAdmin();
  const subirMutation = useSubirImagenProductoAdmin();

  useEffect(() => {
    if (producto) {
      setForm({
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        descripcion: producto.descripcion ?? '',
        imagenUrl: producto.imagenUrl ?? '',
        orden: producto.orden ?? 0,
        activo: producto.activo,
        esNuevo: Boolean(producto.esNuevo),
        esDestacado: Boolean(producto.esDestacado),
        ...comercialDesdeProducto(producto),
      });
    }
  }, [producto]);

  const opcionesCategorias = useMemo(
    () =>
      (categorias ?? []).map((c) => ({
        value: c.nombre,
        label: c.nombre,
      })),
    [categorias],
  );

  const cambiarCampo = (campo) => (e) => {
    const valor =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.type === 'number'
          ? Number(e.target.value)
          : e.target.value;
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
    setErrorServidor('');
  };

  const cambiarTexto = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
    setErrorServidor('');
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!esEdicion && !form.id.trim()) nuevosErrores.id = 'El ID es obligatorio';
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!form.categoria.trim()) nuevosErrores.categoria = 'La categoría es obligatoria';
    Object.assign(nuevosErrores, validarComercial(form));
    setErrores(nuevosErrores);
    const valido = Object.keys(nuevosErrores).length === 0;
    if (!valido) notificarErroresCliente(nuevosErrores);
    return valido;
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      let imagenUrl = form.imagenUrl.trim() || null;

      if (archivo) {
        const productoId = esEdicion ? id : form.id.trim();
        const upload = await subirMutation.mutateAsync({
          file: archivo,
          productoId,
          previousUrl: producto?.imagenUrl,
        });
        imagenUrl = upload.url;
      }

      const payload = {
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        descripcion: form.descripcion.trim() || null,
        imagenUrl,
        orden: Number(form.orden) || 0,
        activo: form.activo,
        esNuevo: form.esNuevo,
        esDestacado: form.esDestacado,
        ...buildPayloadComercial(form),
      };

      if (esEdicion) {
        await actualizarMutation.mutateAsync({ id, payload });
      } else {
        await crearMutation.mutateAsync({ ...payload, id: form.id.trim() });
      }
      navigate('/admin/productos');
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  const cargando = cargandoProducto || cargandoCategorias;

  return (
    <PageLayout
      title={esEdicion ? 'Editar producto' : 'Nuevo producto'}
      description="Contenido visible en la landing; los datos comerciales alimentan al asistente (no se publican precios en la web)."
      actions={
        <Link to="/admin/productos">
          <Button variant="secondary">Volver</Button>
        </Link>
      }
    >
      {errorServidor && <Alert variant="error">{errorServidor}</Alert>}
      {cargando && <Alert variant="info">Cargando…</Alert>}

      {!cargando && (
        <form className="admin-form" onSubmit={enviar}>
          <div className="admin-form__grid">
            <Input
              label="ID (código interno)"
              name="id"
              value={form.id}
              onChange={cambiarCampo('id')}
              error={errores.id}
              disabled={esEdicion}
              required
            />
            <Input
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={cambiarCampo('nombre')}
              error={errores.nombre}
              required
            />
            <Select
              label="Categoría"
              name="categoria"
              value={form.categoria}
              onChange={cambiarCampo('categoria')}
              error={errores.categoria}
              placeholder="Seleccioná categoría"
              options={opcionesCategorias}
              required
            />
            <Input
              label="Orden"
              name="orden"
              type="number"
              value={form.orden}
              onChange={cambiarCampo('orden')}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="producto-imagen">
              Imagen del producto
            </label>
            <input
              id="producto-imagen"
              type="file"
              accept="image/*"
              className="admin-field__input"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            />
            <span className="admin-field__hint">
              Se sube a Supabase en carpeta <strong>productos/</strong> y se convierte a WebP.
            </span>
          </div>

          {form.imagenUrl && (
            <img src={form.imagenUrl} alt={form.nombre || 'Vista previa'} className="adminMediaPreview" />
          )}

          <Input
            label="URL de imagen (manual o tras subir archivo)"
            name="imagenUrl"
            value={form.imagenUrl}
            onChange={cambiarCampo('imagenUrl')}
            placeholder="https://..."
          />

          <Input
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={cambiarCampo('descripcion')}
          />

          <section className="admin-form__section">
            <h2 className="admin-form__section-title">Datos comerciales (asistente / CRM)</h2>
            <p className="admin-field__hint" style={{ marginTop: 0 }}>
              Precios en pesos ARS. No aparecen en la landing pública.
            </p>
            <div className="admin-form__grid">
              <Input
                label="Precio minorista (ARS)"
                name="precioMinorista"
                type="number"
                min="0"
                step="0.01"
                value={form.precioMinorista}
                onChange={cambiarTexto('precioMinorista')}
                error={errores.precioMinorista}
                placeholder="Opcional"
              />
              <Input
                label="Precio mayorista (ARS)"
                name="precioMayorista"
                type="number"
                min="0"
                step="0.01"
                value={form.precioMayorista}
                onChange={cambiarTexto('precioMayorista')}
                error={errores.precioMayorista}
                placeholder="Opcional"
              />
              <Input
                label="Cantidad mínima precio mayorista"
                name="cantidadMinimaMayorista"
                type="number"
                min="1"
                step="1"
                value={form.cantidadMinimaMayorista}
                onChange={cambiarTexto('cantidadMinimaMayorista')}
                error={errores.cantidadMinimaMayorista}
                placeholder="Ej. 10 — vacío = solo si declara mayorista"
              />
              <Input
                label="Stock"
                name="stockUnidades"
                type="number"
                min="0"
                step="1"
                value={form.stockUnidades}
                onChange={cambiarCampo('stockUnidades')}
              />
              <Select
                label="Unidad de stock"
                name="unidadStock"
                value={form.unidadStock}
                onChange={cambiarCampo('unidadStock')}
                options={UNIDADES_STOCK}
              />
              <Input
                label="Oferta (%)"
                name="ofertaPorcentaje"
                type="number"
                min="0"
                max="100"
                step="1"
                value={form.ofertaPorcentaje}
                onChange={cambiarTexto('ofertaPorcentaje')}
                error={errores.ofertaPorcentaje}
                placeholder="0–100, opcional"
              />
              <Input
                label="Oferta desde"
                name="ofertaDesde"
                type="datetime-local"
                value={form.ofertaDesde}
                onChange={cambiarTexto('ofertaDesde')}
              />
              <Input
                label="Oferta hasta"
                name="ofertaHasta"
                type="datetime-local"
                value={form.ofertaHasta}
                onChange={cambiarTexto('ofertaHasta')}
                error={errores.ofertaHasta}
              />
            </div>
            <label className="admin-checkbox admin-form__checkbox">
              <input
                type="checkbox"
                checked={form.activoComercial}
                onChange={cambiarCampo('activoComercial')}
              />
              Activo comercialmente (visible para el asistente al cotizar)
            </label>
          </section>

          <div className="admin-form__checkboxGroup">
            <label className="admin-checkbox admin-form__checkbox">
              <input type="checkbox" checked={form.esNuevo} onChange={cambiarCampo('esNuevo')} />
              Nuevo
            </label>
            <label className="admin-checkbox admin-form__checkbox">
              <input
                type="checkbox"
                checked={form.esDestacado}
                onChange={cambiarCampo('esDestacado')}
              />
              Destacado
            </label>
            <label className="admin-checkbox admin-form__checkbox">
              <input type="checkbox" checked={form.activo} onChange={cambiarCampo('activo')} />
              Activo en la landing
            </label>
          </div>

          <div className="admin-form__actions">
            <Button
              type="submit"
              disabled={
                crearMutation.isPending ||
                actualizarMutation.isPending ||
                subirMutation.isPending
              }
            >
              {esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </form>
      )}
    </PageLayout>
  );
}
