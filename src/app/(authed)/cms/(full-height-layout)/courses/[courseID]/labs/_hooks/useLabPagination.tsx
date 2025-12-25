import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";
import { cmsCourseService } from "~/services/cms-course.service";
import { type GetLabPaginationParams } from "~/services/cms-lab.service";

interface Params {
  course_id: string;
  args: GetLabPaginationParams;
}

const useLabPagination = (params: Params) => {
  const { course_id, args } = params;
  return usePagination({
    queryKey: queryKeys.lab.allWithParams(params),
    queryFn: ({ pageParam }) =>
      cmsCourseService.getLabByCoursePagination(course_id, {
        ...args,
        page: pageParam,
      }),
  });
};

export default useLabPagination;
