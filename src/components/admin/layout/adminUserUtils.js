export function getAdminUserDisplayName(usuario) {
  if (!usuario) return 'Usuario';

  const nombre = `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim();
  return nombre || usuario.email || 'Usuario';
}

export function getAdminUserInitials(usuario) {
  const display = getAdminUserDisplayName(usuario);

  if (display.includes('@')) {
    return display.slice(0, 2).toUpperCase();
  }

  const parts = display.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
