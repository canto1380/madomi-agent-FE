/** Códigos de permiso — sincronizar con `backend/src/constants/permisos.js` */

export const PERMISOS_CMS = {
  LEER: 'cms.leer',
  EDITAR: 'cms.editar',
};

export const PERMISOS_COMERCIAL = {
  LEER: 'comercial.leer',
  ESCRIBIR: 'comercial.escribir',
  CONTEXTO_PUBLICAR: 'comercial.contexto.publicar',
};

export function usuarioTienePermiso(usuario, codigo) {
  if (!codigo) return true;
  const codigos = usuario?.permisosCodigos;
  if (!Array.isArray(codigos)) return true;
  return codigos.includes(codigo);
}

export function usuarioTieneAlgunPermiso(usuario, codigosPermiso) {
  if (!codigosPermiso?.length) return true;
  return codigosPermiso.some((codigo) => usuarioTienePermiso(usuario, codigo));
}
