export function PageLayout({ title, description, actions, children }) {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div className="admin-page__header-text">
          <h1 className="admin-page__title">{title}</h1>
          {description && <p className="admin-page__description">{description}</p>}
        </div>
        {actions && <div className="admin-page__actions">{actions}</div>}
      </header>
      <div className="admin-page__content">{children}</div>
    </div>
  );
}
