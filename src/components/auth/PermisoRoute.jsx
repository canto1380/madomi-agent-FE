import { Navigate } from 'react-router-dom';
import { usePermisosUsuario } from '../../hooks/usePermisosUsuario.js';
import { PageLayout } from '../admin/ui/PageLayout.jsx';
import { Alert } from '../admin/ui/Alert.jsx';

export function PermisoRoute({ children, permiso, permisos, redirectTo = '/admin' }) {
  const { puede, puedeAlguno } = usePermisosUsuario();
  const codigos = permisos ?? (permiso ? [permiso] : []);
  const permitido = codigos.length === 0 || puedeAlguno(codigos);

  if (!permitido) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <PageLayout title="Acceso restringido" description="Tu rol no incluye este módulo.">
        <Alert variant="error">No tenés permiso para ver esta sección.</Alert>
      </PageLayout>
    );
  }

  return children;
}
