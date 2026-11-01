import { useNavigate } from 'react-router-dom';
import { AdminIconButton } from '../ui/AdminIconButton.jsx';
import { getAdminUserDisplayName, getAdminUserInitials } from './adminUserUtils.js';
import { leerMensajeApi } from '../../../utils/apiMessage.js';
import { notificarAdmin } from '../../../utils/admin/notificarAdmin.js';

export function AdminUserMenu({ usuario, onLogout, compact = false }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const data = await onLogout();
      notificarAdmin({
        type: 'success',
        message: leerMensajeApi(data) || 'Sesión cerrada',
      });
    } catch (err) {
      notificarAdmin({
        type: 'error',
        message: err.message || 'No se pudo cerrar la sesión',
      });
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const displayName = getAdminUserDisplayName(usuario);
  const initials = getAdminUserInitials(usuario);

  return (
    <div className={`adminUserMenu ${compact ? 'adminUserMenu--compact' : ''}`.trim()}>
      <div className="adminUserMenu__profile">
        <span className="adminUserMenu__avatar" aria-hidden="true">
          {initials}
        </span>
        <div className="adminUserMenu__info">
          <span className="adminUserMenu__name">{displayName}</span>
          {usuario?.email && displayName !== usuario.email && (
            <span className="adminUserMenu__email">{usuario.email}</span>
          )}
        </div>
      </div>
      <AdminIconButton
        icon="logout"
        label="Cerrar sesión"
        variant="ghost"
        onClick={handleLogout}
      />
    </div>
  );
}
