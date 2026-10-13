import { Button } from './Button.jsx';

export function AdminFilterBar({
  search = '',
  onSearchChange,
  searchPlaceholder = 'Buscar…',
  showSearch = true,
  filters = [],
  onFilterChange,
  onClear,
  showClear = true,
}) {
  const hasActiveFilters =
    (showSearch && Boolean(search.trim())) ||
    filters.some((filter) => {
      const emptyValues = ['', 'todos', 'all'];
      return filter.value && !emptyValues.includes(filter.value);
    });

  return (
    <div className="adminFilterBar">
      {showSearch && (
        <div className="adminFilterBar__search">
          <input
            type="search"
            className="adminFilterBar__input"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label={searchPlaceholder}
          />
        </div>
      )}

      {filters.map((filter) => (
        <div key={filter.key} className="adminFilterBar__filter">
          <label className="adminFilterBar__label" htmlFor={`admin-filter-${filter.key}`}>
            {filter.label}
          </label>
          <select
            id={`admin-filter-${filter.key}`}
            className="adminFilterBar__select"
            value={filter.value}
            onChange={(event) => onFilterChange(filter.key, event.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {showClear && hasActiveFilters && onClear && (
        <Button type="button" variant="ghost" size="sm" className="adminFilterBar__clear" onClick={onClear}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
