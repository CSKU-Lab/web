import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsCourseService } from "~/services/cms-course.service";

interface Args {
  courseID: string;
}

function useGetCourse({ courseID }: Args) {
  return useQuery({
    queryKey: queryKeys.course.getById(courseID),
    queryFn: () => cmsCourseService.getById(courseID),
  });
}

export default useGetCourse;
