export function Alert({ variant = 'error', children }) {
  return <div className={`auth-alert auth-alert--${variant}`}>{children}</div>;
}
