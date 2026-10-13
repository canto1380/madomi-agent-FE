import { AdminIconButton } from './AdminIconButton.jsx';

export function AdminActivoActions({
  activo,
  onDesactivar,
  onReactivar,
  desactivarLabel = 'Desactivar',
  reactivarLabel = 'Activar',
}) {
  if (activo) {
    return (
      <AdminIconButton
        icon="ban"
        label={desactivarLabel}
        variant="danger"
        onClick={onDesactivar}
      />
    );
  }

  return (
    <AdminIconButton
      icon="check"
      label={reactivarLabel}
      variant="secondary"
      onClick={onReactivar}
    />
  );
}
