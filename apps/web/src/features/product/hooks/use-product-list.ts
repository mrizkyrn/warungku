import { useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce.js';

import { useProductsQuery } from '../queries.js';

export function useProductList(pageSize = 10) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const query = useProductsQuery({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  });

  return {
    search,
    handleSearchChange: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    page,
    setPage,
    totalPages: query.data?.meta?.totalPages ?? 1,
    ...query,
  };
}
