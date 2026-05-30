import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { queryKeys } from "~/queryKeys";
import { coreCourseService } from "~/services/core-course.service";

export const useEnrollCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  const enroll = useMutation({
    mutationFn: () => coreCourseService.enroll(courseId),
    onSuccess: async () => {
      toast.success("Enrolled successfully");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.core.courses.all,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
        return;
      }
      toast.error("Failed to enroll");
    },
  });

  return { enroll };
};

export const useUnenrollCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  const unenroll = useMutation({
    mutationFn: () => coreCourseService.unenroll(courseId),
    onSuccess: async () => {
      toast.success("Unenrolled successfully");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.core.courses.all,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
        return;
      }
      toast.error("Failed to unenroll");
    },
  });

  return { unenroll };
};