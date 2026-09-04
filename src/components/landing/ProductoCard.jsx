import { useTilt3D } from '../../hooks/useTilt3D.js';

export function ProductoCard({ producto, style, variant = 'default' }) {
  const inicial = producto.nombre?.charAt(0) || '?';
  const { ref, onMove, onLeave } = useTilt3D(variant === 'destacado' ? 6 : 8);
  const className = [
    'productoCard',
    'card3d',
    'card3dInteractive',
    variant === 'destacado' && 'productoCardDestacado',
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
      {variant === 'destacado' && (
        <span className="productoCardBadge" aria-label="Producto nuevo">
          Nuevo
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
