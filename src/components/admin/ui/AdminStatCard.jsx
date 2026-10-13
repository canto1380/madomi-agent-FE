import { Link } from 'react-router-dom';

export function AdminStatCard({
  label,
  value,
  activeCount,
  loading = false,
  error = false,
  pending = false,
  to,
  actionLabel,
  hint,
}) {
  const displayValue = loading ? '…' : error ? '—' : pending ? '—' : value;

  const metaText =
    !loading &&
    !error &&
    !pending &&
    activeCount != null &&
    activeCount !== ''
      ? `${activeCount} activos`
      : null;

  const content = (
    <>
      <span className="adminStatCard__label">{label}</span>
      <span className={`adminStatCard__value ${pending ? 'adminStatCard__value--pending' : ''}`.trim()}>
        {displayValue}
      </span>
      {metaText && <span className="adminStatCard__meta">{metaText}</span>}
      {pending && !loading && !error && (
        <span className="adminStatCard__hint">{hint ?? 'Próximamente'}</span>
      )}
      {to && actionLabel && !loading && !error && !pending && (
        <span className="adminStatCard__action">{actionLabel}</span>
      )}
    </>
  );

  if (to && !pending) {
    return (
      <Link to={to} className="adminStatCard adminStatCard--link">
        {content}
      </Link>
    );
  }

  return (
    <div className={`adminStatCard ${pending ? 'adminStatCard--pending' : ''}`.trim()}>{content}</div>
  );
}
