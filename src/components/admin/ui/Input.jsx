export function Input({ label, id, error, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`admin-field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="admin-field__label">
          {label}
        </label>
      )}
      <input id={inputId} className={`admin-field__input ${error ? 'admin-field__input--error' : ''}`} {...props} />
      {error && <span className="admin-field__error">{error}</span>}
    </div>
  );
}
