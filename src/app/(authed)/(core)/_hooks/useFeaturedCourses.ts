import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { coreCourseService } from "~/services/core-course.service";

export const useFeaturedCourses = (limit: number = 4) => {
  return useQuery({
    queryKey: queryKeys.core.featuredCourses.allWithParams({ limit }),
    queryFn: () => coreCourseService.getFeatured(limit),
  });
};