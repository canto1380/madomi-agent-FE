import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useAdminListFilters(defaults = { q: '' }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') ?? defaults.q ?? '';

  const getFilter = useCallback(
    (key, defaultValue = '') => searchParams.get(key) ?? defaults[key] ?? defaultValue,
    [searchParams, defaults],
  );

  const setSearch = useCallback(
    (value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set('q', value);
          else next.delete('q');
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setFilter = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const defaultValue = defaults[key] ?? '';
          if (value && value !== defaultValue) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams, defaults],
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams();
    Object.entries(defaults).forEach(([key, value]) => {
      if (value && value !== 'todos' && value !== 'all') {
        next.set(key, value);
      }
    });
    setSearchParams(next, { replace: true });
  }, [setSearchParams, defaults]);

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(defaults).some(([key, defaultValue]) => {
        const current = key === 'q' ? search : getFilter(key, defaultValue);
        return current !== defaultValue && current !== '';
      }),
    [defaults, search, getFilter],
  );

  return {
    search,
    setSearch,
    getFilter,
    setFilter,
    clearFilters,
    hasActiveFilters,
  };
}
