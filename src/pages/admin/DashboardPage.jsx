import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/admin/ui/PageLayout.jsx';
import { Button } from '../../components/admin/ui/Button.jsx';
import { Alert } from '../../components/admin/ui/Alert.jsx';
import { AdminStatCard } from '../../components/admin/ui/AdminStatCard.jsx';
import { useAdminStats } from '../../hooks/admin/useAdminStats.js';
import { useUsuarios } from '../../hooks/admin/useUsuarios.js';
import { useRoles } from '../../hooks/admin/useRoles.js';
import { usePermisos } from '../../hooks/admin/usePermisos.js';

export default function DashboardPage() {
  const statsQuery = useAdminStats();
  const usuariosQuery = useUsuarios({ incluirInactivos: 'true' });
  const rolesQuery = useRoles();
  const permisosQuery = usePermisos();

  const stats = statsQuery.data;
  const totalUsuarios = usuariosQuery.data?.length ?? 0;
  const usuariosActivos = usuariosQuery.data?.filter((u) => u.activo !== false).length ?? 0;
  const totalRoles = rolesQuery.data?.length ?? 0;
  const totalPermisos = permisosQuery.data?.length ?? 0;

  return (
    <PageLayout title="Panel de administración" description="Resumen del CMS y accesos rápidos.">
      {statsQuery.isError && (
        <Alert variant="error">
          No se pudieron cargar las métricas del CMS: {statsQuery.error.message}
        </Alert>
      )}

      <section className="adminDashboard">
        <div className="adminDashboard__group">
          <h2 className="adminDashboard__sectionTitle">Contenido del sitio</h2>
          <div className="adminDashboard__stats">
            <AdminStatCard
              label="Productos"
              value={stats?.productos ?? 0}
              activeCount={stats ? stats.productos - stats.productosInactivos : null}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/productos"
              actionLabel="Ver catálogo"
            />
            <AdminStatCard
              label="Categorías"
              value={stats?.categorias ?? 0}
              activeCount={stats ? stats.categorias - stats.categoriasInactivas : null}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/categorias"
              actionLabel="Gestionar"
            />
            <AdminStatCard
              label="Textos"
              value={stats?.textos ?? 0}
              activeCount={stats ? stats.textos - stats.textosInactivos : null}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/textos"
              actionLabel="Editar textos"
            />
            <AdminStatCard
              label="Media"
              value={stats?.media ?? 0}
              activeCount={stats ? stats.media - stats.mediaInactivos : null}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/media"
              actionLabel="Gestionar"
            />
            <AdminStatCard
              label="Redes sociales"
              value={stats?.redes ?? 0}
              activeCount={stats ? stats.redes - stats.redesInactivas : null}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
              to="/admin/redes"
              actionLabel="Gestionar"
            />
            <AdminStatCard
              label="Destacados"
              value={stats?.destacados ?? 0}
              loading={statsQuery.isLoading}
              error={statsQuery.isError}
            />
          </div>
        </div>

        <div className="adminDashboard__group">
          <h2 className="adminDashboard__sectionTitle">Identidad y acceso</h2>
          <div className="adminDashboard__stats">
            <AdminStatCard
              label="Usuarios"
              value={totalUsuarios}
              activeCount={usuariosActivos}
              loading={usuariosQuery.isLoading}
              error={usuariosQuery.isError}
              to="/admin/usuarios"
              actionLabel="Ver listado"
            />
            <AdminStatCard
              label="Roles"
              value={totalRoles}
              loading={rolesQuery.isLoading}
              error={rolesQuery.isError}
              to="/admin/roles"
              actionLabel="Gestionar"
            />
            <AdminStatCard
              label="Permisos"
              value={totalPermisos}
              loading={permisosQuery.isLoading}
              error={permisosQuery.isError}
              to="/admin/permisos"
              actionLabel="Gestionar"
            />
          </div>
        </div>

        <section className="adminDashboard__quick">
          <h2 className="adminDashboard__sectionTitle">Accesos rápidos</h2>
          <div className="adminDashboard__quickGroups">
            <div className="adminDashboard__quickGroup">
              <h3 className="adminDashboard__quickLabel">Contenido</h3>
              <div className="adminDashboard__actions">
                <Link to="/admin/productos/nuevo">
                  <Button>Nuevo producto</Button>
                </Link>
                <Link to="/admin/textos">
                  <Button variant="secondary">Editar textos</Button>
                </Link>
                <Link to="/admin/media">
                  <Button variant="secondary">Media</Button>
                </Link>
              </div>
            </div>
            <div className="adminDashboard__quickGroup">
              <h3 className="adminDashboard__quickLabel">Sistema</h3>
              <div className="adminDashboard__actions">
                <Link to="/admin/usuarios/nuevo">
                  <Button variant="secondary">Nuevo usuario</Button>
                </Link>
                <Link to="/admin/roles/nuevo">
                  <Button variant="secondary">Nuevo rol</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </PageLayout>
  );
}
