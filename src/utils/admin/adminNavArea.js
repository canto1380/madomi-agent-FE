export const ADMIN_AREAS = {
  CMS: 'cms',
  COMERCIAL: 'comercial',
};

export function getAdminAreaFromPath(pathname) {
  if (pathname.startsWith('/admin/comercial')) {
    return ADMIN_AREAS.COMERCIAL;
  }
  return ADMIN_AREAS.CMS;
}

export function adminAreaHomePath(area) {
  return area === ADMIN_AREAS.COMERCIAL ? '/admin/comercial' : '/admin';
}
