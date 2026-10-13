import { useTilt3D } from '../../hooks/useTilt3D.js';

export function ProductoCard({
  producto,
  style,
  variant = 'default',
  showDestacadoBadge = false,
}) {
  const inicial = producto.nombre?.charAt(0) || '?';
  const esNuevo = variant === 'nuevo';
  const esDestacado = showDestacadoBadge || producto.esDestacado;
  const tiltGrados = esNuevo ? 6 : 8;
  const { ref, onMove, onLeave } = useTilt3D(tiltGrados);
  const className = [
    'productoCard',
    'card3d',
    'card3dInteractive',
    esNuevo && 'productoCardDestacado',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      ref={ref}
      className={className}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {esNuevo && (
        <span className="productoCardBadge" aria-label="Producto nuevo">
          Nuevo
        </span>
      )}
      {!esNuevo && esDestacado && (
        <span className="productoCardBadge productoCardBadgeDestacado" aria-label="Producto destacado">
          Destacado
        </span>
      )}
      <div className="productoCardShine" aria-hidden="true" />
      <div className="productoCardImagen" aria-hidden="true">
        {producto.imagenUrl ? (
          <img src={producto.imagenUrl} alt={producto.nombre} loading="lazy" />
        ) : (
          <span className="productoCardPlaceholder">{inicial}</span>
        )}
      </div>
      <div className="productoCardBody">
        {producto.categoria && <span className="productoCardCategoria">{producto.categoria}</span>}
        <h3 className="productoCardNombre">{producto.nombre}</h3>
        {producto.descripcion && <p className="productoCardDesc">{producto.descripcion}</p>}
      </div>
    </article>
  );
}
