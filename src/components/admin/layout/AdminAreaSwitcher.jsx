import { Link, useLocation } from 'react-router-dom';
import { ADMIN_AREAS, adminAreaHomePath, getAdminAreaFromPath } from '../../../utils/admin/adminNavArea.js';
import { PERMISOS_CMS, PERMISOS_COMERCIAL } from '../../../constants/permisosAdmin.js';
import { usePermisosUsuario } from '../../../hooks/usePermisosUsuario.js';

export function AdminAreaSwitcher({ className = '' }) {
  const { pathname } = useLocation();
  const area = getAdminAreaFromPath(pathname);
  const { puede } = usePermisosUsuario();

  const puedeCms = puede(PERMISOS_CMS.LEER);
  const puedeComercial = puede(PERMISOS_COMERCIAL.LEER);

  if (!puedeCms && !puedeComercial) {
    return null;
  }

  if (puedeCms && !puedeComercial) {
    return null;
  }

  if (!puedeCms && puedeComercial) {
    return null;
  }

  return (
    <div className={`adminAreaSwitcher ${className}`.trim()} role="tablist" aria-label="Área del panel">
      <Link
        to={adminAreaHomePath(ADMIN_AREAS.CMS)}
        role="tab"
        aria-selected={area === ADMIN_AREAS.CMS}
        className={`adminAreaSwitcher__tab ${
          area === ADMIN_AREAS.CMS ? 'adminAreaSwitcher__tab--active' : ''
        }`.trim()}
      >
        Sitio
      </Link>
      <Link
        to={adminAreaHomePath(ADMIN_AREAS.COMERCIAL)}
        role="tab"
        aria-selected={area === ADMIN_AREAS.COMERCIAL}
        className={`adminAreaSwitcher__tab ${
          area === ADMIN_AREAS.COMERCIAL ? 'adminAreaSwitcher__tab--active' : ''
        }`.trim()}
      >
        Comercial
      </Link>
    </div>
  );
}
