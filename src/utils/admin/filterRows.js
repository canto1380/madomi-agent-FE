export function filterRows(rows, { search = '', searchKeys = [], filters = {} } = {}) {
  if (!rows?.length) return [];

  let result = rows;

  const term = search.trim().toLowerCase();
  if (term) {
    result = result.filter((row) =>
      searchKeys.some((key) => {
        const value = typeof key === 'function' ? key(row) : row[key];
        return String(value ?? '')
          .toLowerCase()
          .includes(term);
      }),
    );
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || value === 'todos' || value === 'all') return;

    if (key === 'estado' || key === 'activo') {
      if (value === 'activo') {
        result = result.filter((row) => row.activo !== false);
      } else if (value === 'inactivo') {
        result = result.filter((row) => row.activo === false);
      }
    }
  });

  return result;
}
