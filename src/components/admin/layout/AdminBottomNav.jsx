import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  CMS_NAV_ITEMS,
  COMERCIAL_NAV_ITEMS,
  ADMIN_BOTTOM_PRIMARY_COUNT,
  filtrarNavPorPermisos,
} from './adminNavConfig.js';
import { AdminNavIcon } from './AdminNavIcons.jsx';
import { AdminUserMenu } from './AdminUserMenu.jsx';
import { ADMIN_AREAS, getAdminAreaFromPath } from '../../../utils/admin/adminNavArea.js';
import { usePermisosUsuario } from '../../../hooks/usePermisosUsuario.js';

export function AdminBottomNav({ usuario, onLogout }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();
  const area = getAdminAreaFromPath(pathname);
  const { puede } = usePermisosUsuario();
  const navItems = filtrarNavPorPermisos(
    area === ADMIN_AREAS.COMERCIAL ? COMERCIAL_NAV_ITEMS : CMS_NAV_ITEMS,
    puede,
  );
  const primaryItems = navItems.slice(0, ADMIN_BOTTOM_PRIMARY_COUNT);
  const moreItems = navItems.slice(ADMIN_BOTTOM_PRIMARY_COUNT);

  return (
    <>
      {menuAbierto && (
        <div
          className="adminShellBottomNav__backdrop"
          onClick={() => setMenuAbierto(false)}
          role="presentation"
        />
      )}

      {menuAbierto && (
        <div className="adminShellBottomNav__sheet" role="dialog" aria-label="Más opciones">
          <div className="adminShellBottomNav__sheetHeader">
            <AdminUserMenu usuario={usuario} onLogout={onLogout} compact />
          </div>
          <nav className="adminShellBottomNav__sheetNav">
            {moreItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `adminShellBottomNav__sheetLink ${isActive ? 'adminShellBottomNav__sheetLink--active' : ''}`.trim()
                }
                onClick={() => setMenuAbierto(false)}
              >
                <AdminNavIcon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <nav className="adminShellBottomNav" aria-label="Navegación inferior">
        {primaryItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `adminShellBottomNav__link ${isActive ? 'adminShellBottomNav__link--active' : ''}`.trim()
            }
          >
            <AdminNavIcon name={item.icon} />
            <span>{item.shortLabel}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className={`adminShellBottomNav__link adminShellBottomNav__link--more ${
            menuAbierto ? 'adminShellBottomNav__link--active' : ''
          }`.trim()}
          onClick={() => setMenuAbierto((prev) => !prev)}
          aria-expanded={menuAbierto}
          aria-haspopup="dialog"
        >
          <AdminNavIcon name="more" />
          <span>Más</span>
        </button>
      </nav>
    </>
  );
}
