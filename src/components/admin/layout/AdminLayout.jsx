import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { applyBrandingTheme } from '../../../utils/applyBrandingTheme.js';
import { AdminSidebar } from './AdminSidebar.jsx';
import { AdminBottomNav } from './AdminBottomNav.jsx';
import { AdminUserMenu } from './AdminUserMenu.jsx';
import { AdminAreaSwitcher } from './AdminAreaSwitcher.jsx';

export function AdminLayout() {
  const { usuario, logout } = useAuth();

  useEffect(() => {
    applyBrandingTheme();
  }, []);

  return (
    <div className="adminShell">
      <AdminSidebar usuario={usuario} onLogout={logout} />

      <div className="adminShellBody">
        <header className="adminShellMobileHeader">
          <AdminAreaSwitcher className="adminAreaSwitcher--mobile" />
          <AdminUserMenu usuario={usuario} onLogout={logout} compact />
        </header>

        <main className="adminShellMain">
          <Outlet />
        </main>
      </div>

      <AdminBottomNav usuario={usuario} onLogout={logout} />
    </div>
  );
}
