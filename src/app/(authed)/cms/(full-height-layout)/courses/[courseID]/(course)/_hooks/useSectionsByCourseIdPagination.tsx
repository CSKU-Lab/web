import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsSectionService,
  type GetSectionPaginationParams,
} from "~/services/cms-section.service";

interface Params {
  course_id: string;
  args: GetSectionPaginationParams;
}

function useSectionsByCourseIdPagination(params: Params) {
  const { course_id, args } = params;
  return useInfinitePagination({
    queryKey: queryKeys.section.allWithParams(params),
    queryFn: ({ pageParam }) =>
      cmsSectionService.getPagination(
        { ...args, page: pageParam },
        "/cms/courses",
        `/${course_id}/sections`,
      ),
  });
}

export default useSectionsByCourseIdPagination;
