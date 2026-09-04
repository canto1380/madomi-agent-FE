const ALERT_VARIANTS = {
  error: 'alertError',
  success: 'alertSuccess',
};

export function Alert({ variant = 'error', children }) {
  const variantClass = ALERT_VARIANTS[variant] ?? ALERT_VARIANTS.error;
  return <div className={`alert ${variantClass}`}>{children}</div>;
}
