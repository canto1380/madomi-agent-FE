export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`admin-btn admin-btn--${variant} admin-btn--${size} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
