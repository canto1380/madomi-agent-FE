export function Select({ label, id, error, options = [], placeholder, className = '', ...props }) {
  const selectId = id || props.name;
  return (
    <div className={`admin-field ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="admin-field__label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`admin-field__input admin-field__select ${error ? 'admin-field__input--error' : ''}`}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="admin-field__error">{error}</span>}
    </div>
  );
}
