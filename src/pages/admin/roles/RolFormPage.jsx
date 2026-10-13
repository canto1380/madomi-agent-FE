import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Input } from '../../../components/admin/ui/Input.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { PermisosSelector } from '../../../components/admin/roles/PermisosSelector.jsx';
import {
  useRol,
  useCrearRol,
  useActualizarRol,
  useSincronizarPermisosRol,
} from '../../../hooks/admin/useRoles.js';
import { usePermisos } from '../../../hooks/admin/usePermisos.js';

export default function RolFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [permisoIds, setPermisoIds] = useState([]);
  const [errorGeneral, setErrorGeneral] = useState('');

  const { data: rol, isLoading: cargandoRol } = useRol(id);
  const { data: permisos, isLoading: cargandoPermisos } = usePermisos();
  const crearMutation = useCrearRol();
  const actualizarMutation = useActualizarRol();
  const sincronizarMutation = useSincronizarPermisosRol();

  useEffect(() => {
    if (rol) {
      setNombre(rol.nombre);
      setDescripcion(rol.descripcion ?? '');
      setPermisoIds(rol.permisos?.map((p) => p.id) ?? []);
    }
  }, [rol]);

  const enviar = async (e) => {
    e.preventDefault();
    setErrorGeneral('');

    if (!nombre.trim()) {
      setErrorGeneral('El nombre es obligatorio');
      return;
    }

    try {
      if (esEdicion) {
        await actualizarMutation.mutateAsync({
          id,
          payload: { nombre, descripcion: descripcion || null },
        });
        await sincronizarMutation.mutateAsync({ id, permisoIds });
      } else {
        const nuevoRol = await crearMutation.mutateAsync({
          nombre,
          descripcion: descripcion || null,
        });
        if (permisoIds.length > 0) {
          await sincronizarMutation.mutateAsync({
            id: nuevoRol.id,
            permisoIds,
          });
        }
      }
      navigate('/admin/roles');
    } catch (err) {
      setErrorGeneral(err.message);
    }
  };

  const cargando = cargandoRol || cargandoPermisos;
  const guardando =
    crearMutation.isPending ||
    actualizarMutation.isPending ||
    sincronizarMutation.isPending;

  return (
    <PageLayout
      title={esEdicion ? 'Editar rol' : 'Nuevo rol'}
      description="Definí el rol y sus permisos asociados"
      actions={
        <Link to="/admin/roles">
          <Button variant="secondary">Volver</Button>
        </Link>
      }
    >
      {cargando && <Alert variant="info">Cargando...</Alert>}
      {errorGeneral && <Alert variant="error">{errorGeneral}</Alert>}

      {!cargando && (
        <form className="admin-form" onSubmit={enviar}>
          <div className="admin-form__grid">
            <Input
              label="Nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              label="Descripción"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <section className="admin-form__section">
            <h3 className="admin-form__section-title">Permisos</h3>
            <PermisosSelector
              permisos={permisos ?? []}
              selectedIds={permisoIds}
              onChange={setPermisoIds}
            />
          </section>

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
