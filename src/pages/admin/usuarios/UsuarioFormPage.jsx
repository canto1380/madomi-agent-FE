import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Input } from '../../../components/admin/ui/Input.jsx';
import { Select } from '../../../components/admin/ui/Select.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { useUsuario, useCrearUsuario, useActualizarUsuario } from '../../../hooks/admin/useUsuarios.js';
import { useRoles } from '../../../hooks/admin/useRoles.js';

const estadoInicial = {
  email: '',
  clave: '',
  nombre: '',
  apellido: '',
  rolId: '',
  activo: true,
};

export default function UsuarioFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(estadoInicial);
  const [errores, setErrores] = useState({});

  const { data: usuario, isLoading: cargandoUsuario } = useUsuario(id);
  const { data: roles, isLoading: cargandoRoles } = useRoles();
  const crearMutation = useCrearUsuario();
  const actualizarMutation = useActualizarUsuario();

  useEffect(() => {
    if (usuario) {
      setForm({
        email: usuario.email,
        clave: '',
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rolId: usuario.rolId,
        activo: usuario.activo,
      });
    }
  }, [usuario]);

  const opcionesRoles = (roles ?? []).map((rol) => ({
    value: rol.id,
    label: rol.nombre,
  }));

  const cambiarCampo = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.email) nuevosErrores.email = 'El email es obligatorio';
    if (!esEdicion && !form.clave) nuevosErrores.clave = 'La contraseña es obligatoria';
    if (form.clave && form.clave.length < 8) nuevosErrores.clave = 'Mínimo 8 caracteres';
    if (!form.nombre) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!form.apellido) nuevosErrores.apellido = 'El apellido es obligatorio';
    if (!form.rolId) nuevosErrores.rolId = 'Seleccioná un rol';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      email: form.email,
      nombre: form.nombre,
      apellido: form.apellido,
      rolId: form.rolId,
      activo: form.activo,
    };
    if (form.clave) payload.clave = form.clave;

    try {
      if (esEdicion) {
        await actualizarMutation.mutateAsync({ id, payload });
      } else {
        await crearMutation.mutateAsync(payload);
      }
      navigate('/admin/usuarios');
    } catch (err) {
      setErrores({ general: err.message });
    }
  };

  const cargando = cargandoUsuario || cargandoRoles;
  const guardando = crearMutation.isPending || actualizarMutation.isPending;

  return (
    <PageLayout
      title={esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
      description={esEdicion ? 'Modificá los datos del usuario' : 'Creá una cuenta de usuario'}
      actions={
        <Link to="/admin/usuarios">
          <Button variant="secondary">Volver</Button>
        </Link>
      }
    >
      {cargando && <Alert variant="info">Cargando...</Alert>}
      {errores.general && <Alert variant="error">{errores.general}</Alert>}

      {!cargando && (
        <form className="admin-form" onSubmit={enviar}>
          <div className="admin-form__grid">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={cambiarCampo('email')}
              error={errores.email}
              required
            />
            <Input
              label={esEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              name="clave"
              type="password"
              value={form.clave}
              onChange={cambiarCampo('clave')}
              error={errores.clave}
              autoComplete="new-password"
            />
            <Input
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={cambiarCampo('nombre')}
              error={errores.nombre}
              required
            />
            <Input
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={cambiarCampo('apellido')}
              error={errores.apellido}
              required
            />
            <Select
              label="Rol"
              name="rolId"
              value={form.rolId}
              onChange={cambiarCampo('rolId')}
              options={opcionesRoles}
              placeholder="Seleccionar rol"
              error={errores.rolId}
              required
            />
            <label className="admin-checkbox admin-form__checkbox">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={cambiarCampo('activo')}
              />
              Usuario activo
            </label>
          </div>
          <div className="admin-form__actions">
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      )}
    </PageLayout>
  );
}
