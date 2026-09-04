export function Input({ label, id, error, className = '', as = 'input', ...props }) {
  const inputId = id || props.name;
  const Tag = as;

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="fieldLabel">
          {label}
        </label>
      )}
      <Tag
        id={inputId}
        className={`fieldInput ${error ? 'fieldInputError' : ''}`}
        {...props}
      />
      {error && <span className="fieldError">{error}</span>}
    </div>
  );
}
