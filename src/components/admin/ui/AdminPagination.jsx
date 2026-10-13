import { Button } from './Button.jsx';

export function AdminPagination({ paginacion, onPageChange, loading = false }) {
  if (!paginacion || paginacion.totalPages <= 1) {
    return null;
  }

  const { page, totalPages, total, limit } = paginacion;
  const desde = (page - 1) * limit + 1;
  const hasta = Math.min(page * limit, total);

  return (
    <div className="adminPagination">
      <span className="adminPagination__meta">
        {total === 0 ? 'Sin resultados' : `${desde}–${hasta} de ${total}`}
      </span>
      <div className="adminPagination__actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <span className="adminPagination__page">
          Pág. {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
