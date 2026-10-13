export const DEFAULT_AUTH_DESTINO = '/admin';

/** Tras login/signup: respeta ruta protegida previa o va al panel admin. */
export function resolvePostAuthPath(fromPathname) {
  if (
    fromPathname &&
    fromPathname !== '/' &&
    fromPathname !== '/login' &&
    fromPathname !== '/signup'
  ) {
    return fromPathname;
  }

  return DEFAULT_AUTH_DESTINO;
}
