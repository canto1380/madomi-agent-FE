/**
 * Constantes locales del proyecto.
 * Este archivo NO se modifica con update-modulo.ps1.
 * Agregá acá branding, textos, colores y rutas propias del proyecto.
 */
export const APP_CONSTANTS = {
  nombreEmpresa: 'Madomi Pastas',
  tagline: 'Frescura y calidad desde 1993',
  descripcion:
    'Somos una empresa dedicada a la fabricación de pastas frescas desde 1993. Nacimos en San Miguel de Tucumán con la misión de acercar a tu mesa frescura y calidad.',

  branding: {
    colorPrimario: '#b91c1c',
    colorPrimarioOscuro: '#991b1b',
    colorSecundario: '#365314',
    colorAcento: '#ca8a04',
    colorFondo: '#fffbf5',
    colorFondoOscuro: '#1c1917',
    colorTexto: '#292524',
    colorTextoClaro: '#78716c',
    colorError: '#dc2626',
    colorExito: '#16a34a',
    logoUrl: '/logo.png',
    logoAlt: 'Madomi Pastas',
  },

  contacto: {
    telefono: '0381 6686081',
    telefonoLink: '3816686081',
    email: 'madomipastas@gmail.com',
    whatsapp: 'https://wa.me/3816686081',
    direccion: 'Rivadavia 1891, San Miguel de Tucumán, Tucumán, Argentina',
    horario: 'Lun - Vie: 9:00 - 13:30 | 16:00 - 19:00 · Sáb: 9:00 - 14:00',
  },

  hero: {
    titulo: 'La pasta de todos los tucumanos',
    subtitulo:
      'Elaboramos pastas frescas con los mejores ingredientes, llevando tradición y sabor a tu mesa desde 1993.',
    ctaProductos: 'Ver productos',
    ctaContacto: 'Contactanos',
  },

  historia: {
    titulo: 'Nuestra Historia',
    subtitulo: 'Una tradición familiar de excelencia en pastas frescas.',
    parrafos: [
      'Somos la segunda generación de una familia dedicada a la elaboración de productos derivados de la harina. Amamos la buena cocina y es por eso que elaboramos nuestros productos con los mejores ingredientes.',
      'Desde nuestros inicios, hemos mantenido un compromiso inquebrantable con la calidad y la innovación. Cada producto refleja nuestra pasión por la buena mesa y el cuidado artesanal.',
    ],
    stats: [
      { valor: '30+', etiqueta: 'Años de experiencia' },
      { valor: '30+', etiqueta: 'Productos' },
      { valor: '15.000+', etiqueta: 'Familias confían en nosotros' },
      { valor: '30+', etiqueta: 'Clientes y Distribuidores' },
    ],
  },

  productos: {
    titulo: 'Nuestros Productos',
    subtitulo: 'Descubrí la variedad de pastas frescas que elaboramos cada día.',
    vacio: 'No hay productos disponibles en este momento.',
  },

  contactoSection: {
    titulo: 'Contáctanos',
    subtitulo:
      '¿Listo para disfrutar de la mejor pasta fresca? Escribinos y te llevamos frescura y calidad a tu mesa.',
    formulario: {
      nombre: 'Nombre',
      email: 'Email',
      telefono: 'Teléfono',
      mensaje: 'Mensaje',
      enviar: 'Enviar mensaje',
      enviando: 'Enviando...',
      exito: '¡Gracias! Recibimos tu mensaje y te responderemos pronto.',
    },
  },

  nav: {
    inicio: 'Inicio',
    historia: 'Historia',
    productos: 'Productos',
    contacto: 'Contacto',
  },
};

/**
 * Productos estáticos de respaldo mientras no exista GET /api/productos.
 * Contrato API esperado: { data: Producto[] }
 */
export const PRODUCTOS_ESTATICOS = [
  { id: '1', nombre: 'Capellettis de pollo y espinaca', categoria: 'Capellettis' },
  { id: '2', nombre: 'Capellettis de 4 quesos', categoria: 'Capellettis' },
  { id: '3', nombre: 'Ravioles de pollo y espinaca', categoria: 'Ravioles' },
  { id: '4', nombre: 'Ravioles de 4 quesos', categoria: 'Ravioles' },
  { id: '5', nombre: 'Ravioles de pollo y verduras', categoria: 'Ravioles' },
  { id: '6', nombre: 'Sorrentinos de ricota, jamón y muzzarella', categoria: 'Sorrentinos' },
  { id: '7', nombre: 'Sorrentinos de pollo y verduras', categoria: 'Sorrentinos' },
  { id: '8', nombre: 'Noquis con papa', categoria: 'Noquis' },
  { id: '9', nombre: 'Tallarines de espinaca', categoria: 'Tallarines' },
  { id: '10', nombre: 'Tapa pascualina criolla', categoria: 'Tapas' },
  { id: '11', nombre: 'Tapa pascualina hojaldre', categoria: 'Tapas' },
  { id: '12', nombre: 'Tapa de empanadas', categoria: 'Tapas' },
  { id: '13', nombre: 'Pascualina light', categoria: 'Tapas' },
];

export function getMensajeBienvenida() {
  return `${APP_CONSTANTS.tagline} — ${APP_CONSTANTS.nombreEmpresa}`;
}
