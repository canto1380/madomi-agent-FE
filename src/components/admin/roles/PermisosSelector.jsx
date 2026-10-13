export function PermisosSelector({ permisos = [], selectedIds = [], onChange, disabled = false }) {
  const toggle = (id) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((pid) => pid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (!permisos.length) {
    return <p className="admin-empty">No hay permisos disponibles</p>;
  }

  return (
    <div className="admin-permisos-grid">
      {permisos.map((permiso) => (
        <label key={permiso.id} className="admin-permiso-item">
          <input
            type="checkbox"
            checked={selectedIds.includes(permiso.id)}
            onChange={() => toggle(permiso.id)}
            disabled={disabled}
          />
          <span>
            <strong>{permiso.codigo}</strong>
            {permiso.descripcion && (
              <small>{permiso.descripcion}</small>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
