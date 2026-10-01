import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";
import { cmsCourseService } from "~/services/cms-course.service";
import { type GetLabPaginationParams } from "~/services/cms-lab.service";

interface Params {
  course_id: string;
  args: GetLabPaginationParams;
}

const useCourseLabPagination = (params: Params) => {
  const { course_id, args } = params;
  return usePagination({
    queryKey: queryKeys.lab.allWithParams(params),
    queryFn: () => cmsCourseService.getLabByCoursePagination(course_id, args),
  });
};

export default useCourseLabPagination;
