import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute.jsx';
import { AdminLayout } from '../../components/admin/layout/AdminLayout.jsx';
import DashboardPage from '../../pages/admin/DashboardPage.jsx';
import ProductosPage from '../../pages/admin/productos/ProductosPage.jsx';
import ProductoFormPage from '../../pages/admin/productos/ProductoFormPage.jsx';
import CategoriasPage from '../../pages/admin/categorias/CategoriasPage.jsx';
import CategoriaFormPage from '../../pages/admin/categorias/CategoriaFormPage.jsx';
import TextosPage from '../../pages/admin/textos/TextosPage.jsx';
import MediaPage from '../../pages/admin/media/MediaPage.jsx';
import RedesPage from '../../pages/admin/redes/RedesPage.jsx';
import UsuariosPage from '../../pages/admin/usuarios/UsuariosPage.jsx';
import UsuarioFormPage from '../../pages/admin/usuarios/UsuarioFormPage.jsx';
import RolesPage from '../../pages/admin/roles/RolesPage.jsx';
import RolFormPage from '../../pages/admin/roles/RolFormPage.jsx';
import PermisosPage from '../../pages/admin/permisos/PermisosPage.jsx';
import ComercialDashboardPage from '../../pages/admin/comercial/ComercialDashboardPage.jsx';
import ComercialLeadsPage from '../../pages/admin/comercial/ComercialLeadsPage.jsx';
import ComercialLeadDetailPage from '../../pages/admin/comercial/ComercialLeadDetailPage.jsx';
import ComercialPedidosPage from '../../pages/admin/comercial/ComercialPedidosPage.jsx';
import ComercialPresupuestosPage from '../../pages/admin/comercial/ComercialPresupuestosPage.jsx';
import ComercialConversacionPage from '../../pages/admin/comercial/ComercialConversacionPage.jsx';
import ComercialContextoPage from '../../pages/admin/comercial/ComercialContextoPage.jsx';
import { PermisoRoute } from '../../components/auth/PermisoRoute.jsx';
import { PERMISOS_CMS, PERMISOS_COMERCIAL } from '../../constants/permisosAdmin.js';

function rutaComercial(element) {
  return (
    <PermisoRoute permiso={PERMISOS_COMERCIAL.LEER} redirectTo="/admin">
      {element}
    </PermisoRoute>
  );
}

export const adminRoutes = (
  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route
      index
      element={
        <PermisoRoute permiso={PERMISOS_CMS.LEER}>
          <DashboardPage />
        </PermisoRoute>
      }
    />
    <Route path="productos" element={<ProductosPage />} />
    <Route path="productos/nuevo" element={<ProductoFormPage />} />
    <Route path="productos/:id/editar" element={<ProductoFormPage />} />
    <Route path="categorias" element={<CategoriasPage />} />
    <Route path="categorias/nuevo" element={<CategoriaFormPage />} />
    <Route path="categorias/:id/editar" element={<CategoriaFormPage />} />
    <Route path="textos" element={<TextosPage />} />
    <Route path="media" element={<MediaPage />} />
    <Route path="redes" element={<RedesPage />} />
    <Route path="usuarios" element={<UsuariosPage />} />
    <Route path="usuarios/nuevo" element={<UsuarioFormPage />} />
    <Route path="usuarios/:id/editar" element={<UsuarioFormPage />} />
    <Route path="roles" element={<RolesPage />} />
    <Route path="roles/nuevo" element={<RolFormPage />} />
    <Route path="roles/:id/editar" element={<RolFormPage />} />
    <Route path="permisos" element={<PermisosPage />} />

    <Route path="comercial" element={rutaComercial(<ComercialDashboardPage />)} />
    <Route path="comercial/leads" element={rutaComercial(<ComercialLeadsPage />)} />
    <Route path="comercial/leads/:id" element={rutaComercial(<ComercialLeadDetailPage />)} />
    <Route path="comercial/pedidos" element={rutaComercial(<ComercialPedidosPage />)} />
    <Route path="comercial/presupuestos" element={rutaComercial(<ComercialPresupuestosPage />)} />
    <Route path="comercial/conversaciones/:id" element={rutaComercial(<ComercialConversacionPage />)} />
    <Route path="comercial/contexto" element={rutaComercial(<ComercialContextoPage />)} />
  </Route>
);

export default adminRoutes;
