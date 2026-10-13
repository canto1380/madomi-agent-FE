export function DataTable({
  columns,
  data,
  emptyMessage = 'No hay registros',
  keyField = 'id',
  loading = false,
  sort = { key: null, direction: null },
  onSort,
}) {
  if (loading) {
    return (
      <div className="admin-table-wrapper">
        <div className="admin-table-loading">Cargando registros…</div>
      </div>
    );
  }

  if (!data?.length) {
    return <div className="admin-empty">{emptyMessage}</div>;
  }

  const handleSort = (column) => {
    if (!column.sortable || !onSort) return;
    onSort(column.key);
  };

  const getSortClass = (column) => {
    if (!column.sortable || sort.key !== column.key || !sort.direction) return '';
    return sort.direction === 'asc' ? 'admin-table__sort--asc' : 'admin-table__sort--desc';
  };

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
                <th key={col.key} scope="col" className={col.sortable && onSort ? 'admin-table__sortable' : undefined}>
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      className={`admin-table__sort ${getSortClass(col)}`.trim()}
                      onClick={() => handleSort(col)}
                    >
                      <span>{col.header}</span>
                      <span className="admin-table__sortIcon" aria-hidden="true">
                        {sort.key === col.key && sort.direction === 'asc' && '↑'}
                        {sort.key === col.key && sort.direction === 'desc' && '↓'}
                        {sort.key !== col.key && '↕'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col) => (
                <td key={col.key} data-label={col.header}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
