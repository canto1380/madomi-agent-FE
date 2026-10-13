export function Alert({ variant = 'info', children }) {
  return <div className={`admin-alert admin-alert--${variant}`}>{children}</div>;
}
