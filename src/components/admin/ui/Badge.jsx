export function Badge({ children, variant = 'default' }) {
  return <span className={`admin-badge admin-badge--${variant}`}>{children}</span>;
}
