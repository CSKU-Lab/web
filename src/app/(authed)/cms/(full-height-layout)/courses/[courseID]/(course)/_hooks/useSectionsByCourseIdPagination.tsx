import { useParams } from "next/navigation";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsCourseService,
  type GetSectionPaginationParams,
} from "~/services/cms-course.service";

function useSectionsByCourseIdPagination(params: GetSectionPaginationParams) {
  const { courseID } = useParams<{ courseID: string }>();
  return useInfinitePagination({
    queryKey: queryKeys.section.allWithParams(params),
    queryFn: ({ pageParam }) =>
      cmsCourseService.getSectionsByCourseIDPagination(courseID, {
        ...params,
        page: pageParam,
      }),
  });
}

export default useSectionsByCourseIdPagination;
