export function validarContacto({ nombre, email, telefono, mensaje }) {
  const errores = {};

  if (!nombre?.trim()) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (nombre.trim().length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!email?.trim()) {
    errores.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errores.email = 'Ingresá un email válido';
  }

  if (telefono?.trim() && !/^[\d\s\-+()]{6,20}$/.test(telefono.trim())) {
    errores.telefono = 'Ingresá un teléfono válido';
  }

  if (!mensaje?.trim()) {
    errores.mensaje = 'El mensaje es obligatorio';
  } else if (mensaje.trim().length < 10) {
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
  }

  return errores;
}
