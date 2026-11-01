import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Input } from '../../../components/admin/ui/Input.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import {
  useCategoriaAdmin,
  useCrearCategoriaAdmin,
  useActualizarCategoriaAdmin,
} from '../../../hooks/admin/useCategoriasAdmin.js';
import { notificarErroresCliente } from '../../../utils/admin/notificarAdmin.js';

const estadoInicial = {
  nombre: '',
  slug: '',
  orden: 0,
  activo: true,
};

export default function CategoriaFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');

  const { data: categoria, isLoading } = useCategoriaAdmin(id);
  const crearMutation = useCrearCategoriaAdmin();
  const actualizarMutation = useActualizarCategoriaAdmin();

  useEffect(() => {
    if (categoria) {
      setForm({
        nombre: categoria.nombre,
        slug: categoria.slug,
        orden: categoria.orden ?? 0,
        activo: categoria.activo,
      });
    }
  }, [categoria]);

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

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    setErrores(nuevosErrores);
    const valido = Object.keys(nuevosErrores).length === 0;
    if (!valido) notificarErroresCliente(nuevosErrores);
    return valido;
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      slug: form.slug.trim() || undefined,
      orden: Number(form.orden) || 0,
      activo: form.activo,
    };

    try {
      if (esEdicion) {
        await actualizarMutation.mutateAsync({ id, payload });
      } else {
        await crearMutation.mutateAsync(payload);
      }
      navigate('/admin/categorias');
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  return (
    <PageLayout
      title={esEdicion ? 'Editar categoría' : 'Nueva categoría'}
      description="Define el orden de agrupación en la sección productos."
      actions={
        <Link to="/admin/categorias">
          <Button variant="secondary">Volver</Button>
        </Link>
      }
    >
      {errorServidor && <Alert variant="error">{errorServidor}</Alert>}
      {isLoading && <Alert variant="info">Cargando…</Alert>}

      {!isLoading && (
        <form className="admin-form" onSubmit={enviar}>
          <div className="admin-form__grid">
            <Input
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={cambiarCampo('nombre')}
              error={errores.nombre}
              required
            />
            <Input
              label="Slug (opcional)"
              name="slug"
              value={form.slug}
              onChange={cambiarCampo('slug')}
              placeholder="Se genera automáticamente si está vacío"
            />
            <Input
              label="Orden"
              name="orden"
              type="number"
              value={form.orden}
              onChange={cambiarCampo('orden')}
            />
          </div>

          <label className="admin-checkbox admin-form__checkbox">
            <input type="checkbox" checked={form.activo} onChange={cambiarCampo('activo')} />
            Categoría activa
          </label>

          <div className="admin-form__actions">
            <Button type="submit" disabled={crearMutation.isPending || actualizarMutation.isPending}>
              {esEdicion ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </div>
        </form>
      )}
    </PageLayout>
  );
}
