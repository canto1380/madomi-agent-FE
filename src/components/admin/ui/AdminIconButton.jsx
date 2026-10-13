import { AdminNavIcon } from '../layout/AdminNavIcons.jsx';

export function AdminIconButton({
  icon,
  label,
  variant = 'secondary',
  size = 'sm',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`adminIconBtn adminIconBtn--${variant} adminIconBtn--${size} ${className}`.trim()}
      aria-label={label}
      title={label}
      {...props}
    >
      {children ?? <AdminNavIcon name={icon} className="adminIconBtn__icon" />}
    </button>
  );
}
