import { useCallback, useMemo, useState } from 'react';

function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return String(a).localeCompare(String(b), 'es', { sensitivity: 'base', numeric: true });
}

function getColumnValue(row, column) {
  if (!column) return '';
  if (column.sortValue) return column.sortValue(row);

  const value = row[column.key];
  if (value && typeof value === 'object') {
    return value.nombre ?? value.codigo ?? value.length ?? '';
  }

  return value ?? '';
}

export function useTableSort(data = [], columns = [], defaultSort = { key: null, direction: null }) {
  const [sort, setSort] = useState(defaultSort);

  const columnMap = useMemo(
    () => Object.fromEntries(columns.filter((col) => col.key).map((col) => [col.key, col])),
    [columns],
  );

  const toggleSort = useCallback((key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key: null, direction: null };
      return { key, direction: 'asc' };
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!data?.length || !sort.key || !sort.direction) return data ?? [];

    const column = columnMap[sort.key];
    return [...data].sort((rowA, rowB) => {
      const cmp = compareValues(getColumnValue(rowA, column), getColumnValue(rowB, column));
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [columnMap, data, sort.direction, sort.key]);

  return { sortedData, sort, toggleSort };
}
