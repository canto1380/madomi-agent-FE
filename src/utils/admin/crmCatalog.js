export const ESTADOS_LEAD = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'consultando', label: 'Consultando' },
  { value: 'presupuesto_abierto', label: 'Presupuesto abierto' },
  { value: 'presupuesto_enviado', label: 'Presupuesto enviado' },
  { value: 'pedido_cerrado', label: 'Pedido cerrado' },
  { value: 'abandonado', label: 'Abandonado' },
  { value: 'pendiente_validacion_logistica', label: 'Pend. validación logística' },
];

export const CUELLOS_BOTELLA = [
  { value: '', label: 'Sin marcar' },
  { value: 'precio', label: 'Precio' },
  { value: 'envio', label: 'Envío' },
  { value: 'stock', label: 'Stock' },
  { value: 'solo_consulta', label: 'Solo consulta' },
  { value: 'otro', label: 'Otro' },
];

export const ESTADOS_PRESUPUESTO = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'aceptado', label: 'Aceptado' },
  { value: 'vencido', label: 'Vencido' },
  { value: 'rechazado', label: 'Rechazado' },
];

export const ESTADOS_LOGISTICOS = [
  { value: 'pedido_cerrado', label: 'Pedido cerrado' },
  { value: 'en_preparacion', label: 'En preparación' },
  { value: 'en_ruta', label: 'En ruta' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
];

export function etiquetaEstadoLead(estado) {
  return ESTADOS_LEAD.find((e) => e.value === estado)?.label ?? estado ?? '—';
}

export function etiquetaEstadoPresupuesto(estado) {
  return ESTADOS_PRESUPUESTO.find((e) => e.value === estado)?.label ?? estado ?? '—';
}

export function etiquetaEstadoLogistico(estado) {
  return ESTADOS_LOGISTICOS.find((e) => e.value === estado)?.label ?? estado ?? '—';
}

export function etiquetaCuelloBotella(cuello) {
  if (!cuello) return 'Sin marcar';
  return CUELLOS_BOTELLA.find((e) => e.value === cuello)?.label ?? cuello;
}

export function formatearFecha(fecha) {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

export function nombreCliente(cliente) {
  if (!cliente) return '—';
  const nombre = [cliente.nombre, cliente.apellido].filter(Boolean).join(' ').trim();
  return nombre || cliente.email || cliente.telefono || '—';
}

export function variantEstadoLead(estado) {
  switch (estado) {
    case 'pedido_cerrado':
      return 'success';
    case 'abandonado':
      return 'muted';
    case 'presupuesto_enviado':
    case 'presupuesto_abierto':
      return 'warning';
    default:
      return 'default';
  }
}
