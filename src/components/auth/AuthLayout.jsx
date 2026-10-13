export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <h1 className="auth-card__title">{title}</h1>
          {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
        </header>
        {children}
        {footer && <footer className="auth-footer">{footer}</footer>}
      </div>
    </div>
  );
}
