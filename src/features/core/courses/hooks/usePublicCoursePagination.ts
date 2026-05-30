import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  coreCourseService,
  GetCoursePaginationParams,
} from "~/services/core-course.service";

const usePublicCoursePagination = (params: GetCoursePaginationParams) => {
  return useInfinitePagination({
    queryKey: queryKeys.core.courses.allWithParams(params),
    queryFn: ({ pageParam }) =>
      coreCourseService.getCourses({
        ...params,
        page: pageParam,
      }),
  });
};

export default usePublicCoursePagination;