const BTN_VARIANTS = {
  primary: 'btnPrimary',
  outline: 'btnOutline',
  glow: 'btnGlow',
};

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  href,
}) {
  const variantClass = BTN_VARIANTS[variant] ?? BTN_VARIANTS.primary;
  const classes = `btn ${variantClass} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
