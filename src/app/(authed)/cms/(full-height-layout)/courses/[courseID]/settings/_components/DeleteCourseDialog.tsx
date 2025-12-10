import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDeleteDialog from "~/components/crafts/ConfirmDeleteDialog";
import { queryKeys } from "~/queryKeys";
import { cmsCourseService } from "~/services/cms-course.service";
import useGetCourse from "../../_hooks/useGetCourse";

interface Props {
  onClose: () => void;
}

function DeleteCourseDialog({ onClose }: Props) {
  const queryClient = useQueryClient();
  const { courseID } = useParams<{ courseID: string }>();
  const { data: course } = useGetCourse({ courseID });

  const router = useRouter();
  const deleteSemester = useMutation({
    mutationFn: () => cmsCourseService.deleteByID(courseID),
    onSuccess: async () => {
      toast.success("Course deleted successfully");
      await queryClient.refetchQueries({ queryKey: queryKeys.course.all });
      router.push("/cms/courses");
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response?.data?.error);
        return;
      }
    },
  });

  return (
    <ConfirmDeleteDialog
      confirmText={course!.name}
      type="course"
      id={courseID}
      onClose={onClose}
      onConfirm={deleteSemester.mutate}
    />
  );
}

export default DeleteCourseDialog;
