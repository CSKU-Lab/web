import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { coreCourseService } from "~/services/core-course.service";
import type { CourseDetailResponse } from "~/types/public-course";

export const useCourseDetail = (courseId: string) => {
  return useQuery<CourseDetailResponse>({
    queryKey: queryKeys.core.courses.allWithParams({ courseId }),
    queryFn: () => coreCourseService.getCourseById(courseId),
    enabled: !!courseId,
  });
};