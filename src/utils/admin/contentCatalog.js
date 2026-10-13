/** Dónde se muestra cada clave de texto en la landing pública. */
export const TEXTOS_UBICACION = {
  'empresa.nombre': 'Footer — copyright y nombre de marca',
  'empresa.tagline': 'Footer — frase bajo el logo',
  'empresa.descripcion': 'Footer — párrafo descriptivo de la marca',
  'hero.titulo': 'Inicio — título principal del hero',
  'hero.subtitulo': 'Inicio — subtítulo del hero',
  'hero.ctaProductos': 'Inicio — botón "Ver productos"',
  'hero.ctaContacto': 'Inicio — botón de contacto',
  'historia.titulo': 'Historia — título de sección',
  'historia.subtitulo': 'Historia — subtítulo',
  'historia.parrafo.1': 'Historia — párrafo del slider (slide 1)',
  'historia.parrafo.2': 'Historia — párrafo del slider (slide 2)',
  'historia.stat.1.valor': 'Historia — métrica 1 (número)',
  'historia.stat.1.etiqueta': 'Historia — métrica 1 (etiqueta)',
  'historia.stat.2.valor': 'Historia — métrica 2 (número)',
  'historia.stat.2.etiqueta': 'Historia — métrica 2 (etiqueta)',
  'historia.stat.3.valor': 'Historia — métrica 3 (número)',
  'historia.stat.3.etiqueta': 'Historia — métrica 3 (etiqueta)',
  'historia.stat.4.valor': 'Historia — métrica 4 (número)',
  'historia.stat.4.etiqueta': 'Historia — métrica 4 (etiqueta)',
  'productos.titulo': 'Productos — título de sección',
  'productos.subtitulo': 'Productos — subtítulo',
  'productos.vacio': 'Productos — mensaje cuando no hay ítems',
  'contacto.titulo': 'Contacto — título de sección',
  'contacto.subtitulo': 'Contacto — subtítulo',
  'nav.inicio': 'Header y footer — enlace Inicio',
  'nav.historia': 'Header y footer — enlace Historia',
  'nav.productos': 'Header y footer — enlace Productos',
  'nav.contacto': 'Header y footer — enlace Contacto',
  'loUltimo.titulo': 'Productos — franja "Lo último" (título)',
  'loUltimo.subtitulo': 'Productos — franja "Lo último" (subtítulo)',
  'footer.seccionesTitulo': 'Footer — encabezado columna navegación',
  'footer.contactoTitulo': 'Footer — encabezado columna contacto',
  'footer.seguinosTitulo': 'Footer — encabezado cuando hay redes',
  'footer.escribinosTitulo': 'Footer — encabezado sin redes',
  'footer.ctaTexto': 'Footer — texto cuando no hay redes activas',
  'footer.whatsapp': 'Footer — botón WhatsApp',
  'footer.ubicacion': 'Footer — línea de ubicación (barra inferior)',
  'footer.copyright': 'Footer — texto legal del copyright',
};

/** Dónde se muestra cada asset de media. */
export const MEDIA_UBICACION = {
  logo: 'Header y footer — logo principal del sitio',
  'logo-blanco': 'Reserva — logo blanco (fondos oscuros)',
  'video-empresa': 'Historia — video institucional',
  'video-empresa-poster': 'Historia — poster del video',
  favicon: 'Pestaña del navegador — favicon',
};

export function getTextoUbicacion(clave) {
  return TEXTOS_UBICACION[clave] ?? null;
}

export function getMediaUbicacion(clave) {
  return MEDIA_UBICACION[clave] ?? null;
}

export const SECCIONES_TEXTO = [
  'empresa',
  'hero',
  'historia',
  'productos',
  'contacto',
  'nav',
  'loUltimo',
  'footer',
];
