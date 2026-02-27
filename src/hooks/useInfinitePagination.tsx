import {
  type QueryFunction,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import type { PaginationResponse } from "~/types/pagination";

interface Args<T> {
  queryKey: QueryKey;
  queryFn: QueryFunction<PaginationResponse<T>, readonly unknown[], number>;
}

function useInfinitePagination<T>({ queryKey, queryFn }: Args<T>) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 1,
    getPreviousPageParam: (lastPage) => lastPage.pagination.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.total_page) {
        return lastPage.pagination.page + 1;
      }
      return null;
    },
    initialData: {
      pages: [],
      pageParams: [],
    },
  });
  const totalRows = query.data?.pages?.[0]?.pagination?.total_rows ?? 0;

  return {
    ...query,
    totalRows,
  };
}

export default useInfinitePagination;
