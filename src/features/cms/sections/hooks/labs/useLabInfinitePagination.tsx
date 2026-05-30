import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsSectionService,
  type GetSectionLabPaginationParams,
} from "~/services/cms-section.service";

export default function useLabInfinitePagination(
  sectionID: string,
  args: GetSectionLabPaginationParams,
) {
  return useInfinitePagination({
    queryKey: queryKeys.section.labs.allWithParams(sectionID, args),
    queryFn: ({ pageParam }) =>
      cmsSectionService.getLabsPagination(sectionID, {
        ...args,
        page: pageParam,
      }),
  });
}
