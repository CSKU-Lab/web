import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsCompareService,
  type GetComparePaginationParams,
} from "~/services/cms-compare.service";

export default function useComparesPagination(args: GetComparePaginationParams) {
  return useInfinitePagination({
    queryKey: queryKeys.compare.allWithParams(args),
    queryFn: ({ pageParam }) =>
      cmsCompareService.getPagination({
        params: {
          ...args,
          page: pageParam,
        },
        includeScripts: false,
      }),
  });
}
