const UNIDADES_STOCK = [
  { value: 'un', label: 'Unidades (un)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'caja', label: 'Cajas (caja)' },
];

export { UNIDADES_STOCK };

export function toDatetimeLocalValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function parsePrecioOpcional(valor) {
  if (valor === '' || valor === null || valor === undefined) return null;
  const n = Number(valor);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

export function parseEnteroNoNegativo(valor, defaultValue = 0) {
  if (valor === '' || valor === null || valor === undefined) return defaultValue;
  const n = Number.parseInt(String(valor), 10);
  if (Number.isNaN(n) || n < 0) return defaultValue;
  return n;
}

export function parseOfertaPorcentaje(valor) {
  if (valor === '' || valor === null || valor === undefined) return null;
  const n = Number.parseInt(String(valor), 10);
  if (Number.isNaN(n)) return null;
  return n;
}

export function parseFechaOferta(valor) {
  if (!valor) return null;
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/** Campos comerciales para POST/PUT admin productos */
export function parseCantidadMinimaMayorista(valor) {
  if (valor === '' || valor === null || valor === undefined) return null;
  const n = Number.parseInt(String(valor), 10);
  if (Number.isNaN(n) || n < 1) return null;
  return n;
}

export function buildPayloadComercial(form) {
  return {
    precioMinorista: parsePrecioOpcional(form.precioMinorista),
    precioMayorista: parsePrecioOpcional(form.precioMayorista),
    cantidadMinimaMayorista: parseCantidadMinimaMayorista(form.cantidadMinimaMayorista),
    stockUnidades: parseEnteroNoNegativo(form.stockUnidades, 0),
    unidadStock: form.unidadStock || 'un',
    ofertaPorcentaje: parseOfertaPorcentaje(form.ofertaPorcentaje),
    ofertaDesde: parseFechaOferta(form.ofertaDesde),
    ofertaHasta: parseFechaOferta(form.ofertaHasta),
    activoComercial: Boolean(form.activoComercial),
  };
}

export function validarComercial(form) {
  const errores = {};
  const minorista = parsePrecioOpcional(form.precioMinorista);
  const mayorista = parsePrecioOpcional(form.precioMayorista);
  if (form.precioMinorista !== '' && minorista === null) {
    errores.precioMinorista = 'Precio minorista inválido';
  }
  if (form.precioMayorista !== '' && mayorista === null) {
    errores.precioMayorista = 'Precio mayorista inválido';
  }
  const oferta = parseOfertaPorcentaje(form.ofertaPorcentaje);
  if (form.ofertaPorcentaje !== '' && (oferta === null || oferta < 0 || oferta > 100)) {
    errores.ofertaPorcentaje = 'Oferta entre 0 y 100';
  }
  if (form.ofertaDesde && form.ofertaHasta) {
    const d1 = new Date(form.ofertaDesde);
    const d2 = new Date(form.ofertaHasta);
    if (d1 > d2) {
      errores.ofertaHasta = 'La fecha fin debe ser posterior al inicio';
    }
  }
  if (
    form.cantidadMinimaMayorista !== '' &&
    parseCantidadMinimaMayorista(form.cantidadMinimaMayorista) === null
  ) {
    errores.cantidadMinimaMayorista = 'Mínimo 1 unidad, o dejá vacío';
  }
  return errores;
}

export function formatPrecioArs(valor) {
  if (valor == null || valor === '') return '—';
  return `$ ${Number(valor).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function estadoInicialComercial() {
  return {
    precioMinorista: '',
    precioMayorista: '',
    cantidadMinimaMayorista: '',
    stockUnidades: 0,
    unidadStock: 'un',
    ofertaPorcentaje: '',
    ofertaDesde: '',
    ofertaHasta: '',
    activoComercial: true,
  };
}

export function comercialDesdeProducto(producto) {
  if (!producto) return estadoInicialComercial();
  return {
    precioMinorista: producto.precioMinorista ?? '',
    precioMayorista: producto.precioMayorista ?? '',
    cantidadMinimaMayorista: producto.cantidadMinimaMayorista ?? '',
    stockUnidades: producto.stockUnidades ?? 0,
    unidadStock: producto.unidadStock ?? 'un',
    ofertaPorcentaje: producto.ofertaPorcentaje ?? '',
    ofertaDesde: toDatetimeLocalValue(producto.ofertaDesde),
    ofertaHasta: toDatetimeLocalValue(producto.ofertaHasta),
    activoComercial: producto.activoComercial !== false,
  };
}
