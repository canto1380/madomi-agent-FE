const ICONS = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M15 19c.4-2.2 2.2-4 4.5-4" />
    </>
  ),
  roles: (
    <>
      <path d="M12 3 4 7v6c0 4.4 3.6 8 8 8s8-3.6 8-8V7l-8-4Z" />
      <path d="M9.5 12.5 11 14l3.5-3.5" />
    </>
  ),
  permissions: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </>
  ),
  products: (
    <>
      <path d="M6 7h12l-1 12H7L6 7Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </>
  ),
  categories: (
    <>
      <path d="M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v6H4zM14 16h6v6h-6z" />
    </>
  ),
  texts: (
    <>
      <path d="M5 5h14v2H5zM5 11h14v2H5zM5 17h9v2H5z" />
    </>
  ),
  media: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m4 16 5-5 4 4 3-3 4 4" />
    </>
  ),
  social: (
    <>
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="8" r="2.5" />
      <path d="M10.5 13.5 14 10M13.5 10.5 16 13" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="M14 12H4M18 8l4 4-4 4" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  check: (
    <>
      <path d="M20 6 9 17l-5-5" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m4.5 4.5 15 15" />
    </>
  ),
  more: (
    <>
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </>
  ),
  commercial: (
    <>
      <path d="M4 7h16v11H4z" />
      <path d="M8 7V5h8v2" />
      <path d="M12 11v4M10 13h4" />
    </>
  ),
  leads: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  orders: (
    <>
      <path d="M7 4h10l1 16H6L7 4Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  presupuestos: (
    <>
      <path d="M6 4h12v16H6z" />
      <path d="M9 9h6M9 13h6M9 17h4" />
      <path d="M9 4V2h6v2" />
    </>
  ),
};

export function AdminNavIcon({ name, className = '' }) {
  const paths = ICONS[name];

  if (!paths) return null;

  return (
    <svg
      className={`adminNavIcon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
