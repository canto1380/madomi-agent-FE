import { toast } from 'react-toastify';
import { leerMensajeApi } from '../apiMessage.js';

const FALLBACK_OK = 'Acción realizada';
const FALLBACK_ERROR = 'No se pudo completar la acción';
const DURACION_MS = 4500;

function mostrarToast(type, texto) {
  const opciones = {
    autoClose: false,
    customProgressBar: true,
    closeOnClick: true,
    draggable: false,
  };
  let id;

  if (type === 'error') id = toast.error(texto, opciones);
  else if (type === 'info') id = toast.info(texto, opciones);
  else if (type === 'warning') id = toast.warning(texto, opciones);
  else id = toast.success(texto, opciones);

  window.setTimeout(() => toast.dismiss(id), DURACION_MS);
}

export function notificarAdmin({ type = 'success', message } = {}) {
  const texto = String(message || '').trim() || (type === 'error' ? FALLBACK_ERROR : FALLBACK_OK);
  mostrarToast(type, texto);
}

export function notificarErroresCliente(errores) {
  if (!errores || typeof errores !== 'object') return;
  const mensaje = Object.values(errores).find((valor) => typeof valor === 'string' && valor.trim());
  if (mensaje) notificarAdmin({ type: 'error', message: mensaje });
}

export function notificarResultadoMutacion({ data, error, meta = {} } = {}) {
  if (meta?.toast === false) return;

  if (error) {
    notificarAdmin({
      type: 'error',
      message: meta.toastError || error.message || FALLBACK_ERROR,
    });
    return;
  }

  const mensajeApi = leerMensajeApi(data);
  const mensajeUtil = mensajeApi && mensajeApi !== 'OK' ? mensajeApi : '';
  const esInfo = meta.toastType === 'info' || data?.duplicado === true;

  if (esInfo) {
    notificarAdmin({
      type: 'info',
      message: meta.toastMessage || mensajeUtil || 'Sin cambios',
    });
    return;
  }

  notificarAdmin({
    type: meta.toastType === 'error' || meta.toastType === 'warning' ? meta.toastType : 'success',
    message: meta.toastMessage || mensajeUtil || FALLBACK_OK,
  });
}
