import { NavLink, useLocation } from 'react-router-dom';
import { APP_CONSTANTS } from '../../../constants/constants.js';
import {
  CMS_NAV_ITEMS,
  COMERCIAL_NAV_ITEMS,
  filtrarNavPorPermisos,
} from './adminNavConfig.js';
import { AdminNavIcon } from './AdminNavIcons.jsx';
import { AdminUserMenu } from './AdminUserMenu.jsx';
import { AdminAreaSwitcher } from './AdminAreaSwitcher.jsx';
import { ADMIN_AREAS, getAdminAreaFromPath } from '../../../utils/admin/adminNavArea.js';
import { usePermisosUsuario } from '../../../hooks/usePermisosUsuario.js';

export function AdminSidebar({ usuario, onLogout }) {
  const { pathname } = useLocation();
  const area = getAdminAreaFromPath(pathname);
  const { puede } = usePermisosUsuario();
  const navItems = filtrarNavPorPermisos(
    area === ADMIN_AREAS.COMERCIAL ? COMERCIAL_NAV_ITEMS : CMS_NAV_ITEMS,
    puede,
  );
  let lastSection = null;

  return (
    <aside className="adminShellSidebar" aria-label="Navegación del panel">
      <div className="adminShellSidebar__brand">
        <img
          src={APP_CONSTANTS.branding.logoUrl}
          alt={APP_CONSTANTS.branding.logoAlt}
          className="adminShellSidebar__logo"
          width="36"
          height="36"
        />
        <div>
          <p className="adminShellSidebar__title">{APP_CONSTANTS.nombreEmpresa}</p>
          <p className="adminShellSidebar__subtitle">
            {area === ADMIN_AREAS.COMERCIAL ? 'Comercial / CRM' : 'Contenido del sitio'}
          </p>
        </div>
      </div>

      <AdminAreaSwitcher className="adminAreaSwitcher--sidebar" />

      <nav className="adminShellSidebar__nav">
        {navItems.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <div key={item.to}>
              {showSection && (
                <p className="adminShellSidebar__section">{item.section}</p>
              )}
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `adminShellSidebar__link ${isActive ? 'adminShellSidebar__link--active' : ''}`.trim()
                }
              >
                <AdminNavIcon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            </div>
          );
        })}
      </nav>

      <div className="adminShellSidebar__footer">
        <AdminUserMenu usuario={usuario} onLogout={onLogout} />
      </div>
    </aside>
  );
}
