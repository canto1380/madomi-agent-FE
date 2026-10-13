import { PERMISOS_CMS, PERMISOS_COMERCIAL } from '../../../constants/permisosAdmin.js';

export const ADMIN_BOTTOM_PRIMARY_COUNT = 3;

export const CMS_NAV_ITEMS = [
  {
    to: '/admin',
    label: 'Inicio',
    shortLabel: 'Inicio',
    icon: 'home',
    end: true,
    permiso: PERMISOS_CMS.LEER,
  },
  {
    to: '/admin/productos',
    label: 'Productos',
    shortLabel: 'Productos',
    icon: 'products',
    section: 'Contenido',
    permiso: PERMISOS_CMS.LEER,
  },
  {
    to: '/admin/categorias',
    label: 'Categorías',
    shortLabel: 'Categorías',
    icon: 'categories',
    section: 'Contenido',
    permiso: PERMISOS_CMS.LEER,
  },
  {
    to: '/admin/textos',
    label: 'Textos',
    shortLabel: 'Textos',
    icon: 'texts',
    section: 'Contenido',
    permiso: PERMISOS_CMS.LEER,
  },
  {
    to: '/admin/media',
    label: 'Media',
    shortLabel: 'Media',
    icon: 'media',
    section: 'Contenido',
    permiso: PERMISOS_CMS.LEER,
  },
  {
    to: '/admin/redes',
    label: 'Redes',
    shortLabel: 'Redes',
    icon: 'social',
    section: 'Contenido',
    permiso: PERMISOS_CMS.LEER,
  },
  {
    to: '/admin/usuarios',
    label: 'Usuarios',
    shortLabel: 'Usuarios',
    icon: 'users',
    section: 'Sistema',
    permiso: 'usuarios.ver',
  },
  {
    to: '/admin/roles',
    label: 'Roles',
    shortLabel: 'Roles',
    icon: 'roles',
    section: 'Sistema',
    permiso: 'roles.ver',
  },
  {
    to: '/admin/permisos',
    label: 'Permisos',
    shortLabel: 'Permisos',
    icon: 'permissions',
    section: 'Sistema',
    permiso: 'permisos.ver',
  },
];

export const COMERCIAL_NAV_ITEMS = [
  {
    to: '/admin/comercial',
    label: 'Inicio comercial',
    shortLabel: 'Inicio',
    icon: 'commercial',
    end: true,
    permiso: PERMISOS_COMERCIAL.LEER,
  },
  {
    to: '/admin/comercial/leads',
    label: 'Leads',
    shortLabel: 'Leads',
    icon: 'leads',
    section: 'Operación',
    permiso: PERMISOS_COMERCIAL.LEER,
  },
  {
    to: '/admin/comercial/pedidos',
    label: 'Pedidos',
    shortLabel: 'Pedidos',
    icon: 'orders',
    section: 'Operación',
    permiso: PERMISOS_COMERCIAL.LEER,
  },
  {
    to: '/admin/comercial/presupuestos',
    label: 'Presupuestos',
    shortLabel: 'Presup.',
    icon: 'presupuestos',
    section: 'Operación',
    permiso: PERMISOS_COMERCIAL.LEER,
  },
  {
    to: '/admin/comercial/contexto',
    label: 'Contexto bot',
    shortLabel: 'Contexto',
    icon: 'texts',
    section: 'Asistente',
    permiso: PERMISOS_COMERCIAL.LEER,
  },
];

/** @deprecated Usar CMS_NAV_ITEMS o COMERCIAL_NAV_ITEMS según área */
export const ADMIN_NAV_ITEMS = CMS_NAV_ITEMS;

export function isAdminNavActive(pathname, to, end = false) {
  if (end || to === '/admin' || to === '/admin/comercial') {
    return pathname === to || pathname === `${to}/`;
  }

  return pathname === to || pathname.startsWith(`${to}/`);
}

export function filtrarNavPorPermisos(items, puede) {
  return items.filter((item) => !item.permiso || puede(item.permiso));
}
