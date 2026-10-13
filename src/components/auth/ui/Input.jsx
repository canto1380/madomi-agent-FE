export function Input({ label, id, error, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`auth-field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="auth-field__label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`auth-field__input ${error ? 'auth-field__input--error' : ''}`}
        {...props}
      />
      {error && <span className="auth-field__error">{error}</span>}
    </div>
  );
}
