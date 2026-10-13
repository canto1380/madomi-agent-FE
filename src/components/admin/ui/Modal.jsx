import { Button } from './Button.jsx';

export function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="admin-modal__overlay" onClick={onClose} role="presentation">
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <header className="admin-modal__header">
          <h2 id="admin-modal-title" className="admin-modal__title">
            {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar">
            ✕
          </Button>
        </header>
        <div className="admin-modal__body">{children}</div>
        {footer && <footer className="admin-modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}
