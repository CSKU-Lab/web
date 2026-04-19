import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  myCoursesService,
  GetMyCoursesPaginationParams,
} from "~/services/my-courses.service";

const useMyCourseInfPagination = (params: GetMyCoursesPaginationParams) => {
  return useInfinitePagination({
    queryKey: queryKeys.core.myCourses.allWithParams(params),
    queryFn: ({ pageParam }) =>
      myCoursesService.getMyCourses({
        ...params,
        page: pageParam,
      }),
  });
};

export default useMyCourseInfPagination;
