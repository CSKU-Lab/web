import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsSectionService,
  type GetSectionPaginationParams,
} from "~/services/cms-section.service";

function useSectionPagination(args: GetSectionPaginationParams) {
  return useInfinitePagination({
    queryKey: queryKeys.section.all,
    queryFn: ({ pageParam }) =>
      cmsSectionService.getPagination({ ...args, page: pageParam }),
  });
}

export default useSectionPagination;
