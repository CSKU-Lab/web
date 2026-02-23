import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsRunnerService,
  type GetRunnerPaginationParams,
} from "~/services/cms-runner.service";

export default function useRunnersPagination(args: GetRunnerPaginationParams) {
  return useInfinitePagination({
    queryKey: queryKeys.runner.allWithParams(args),
    queryFn: ({ pageParam }) =>
      cmsRunnerService.getPagination({
        params: {
          ...args,
          page: pageParam,
        },
        includeScript: false,
      }),
  });
}
