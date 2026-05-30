import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDeleteDialog, {
  ConfirmDeleteDialogTrigger,
} from "~/components/crafts/ConfirmDeleteDialog/index";
import { cmsCourseService } from "~/services/cms-course.service";
import useGetCourse from "~/features/cms/courses/hooks/useGetCourse";
import type { ChildrenProps } from "~/types/children-props";

function DeleteCourseDialog({ children }: ChildrenProps) {
  const { courseID } = useParams<{ courseID: string }>();
  const { data: course } = useGetCourse({ courseID });

  const router = useRouter();
  const deleteSemester = useMutation({
    mutationFn: () => cmsCourseService.deleteByID(courseID),
    onSuccess: async () => {
      toast.success("Course deleted successfully");
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
      onConfirm={deleteSemester.mutate}
    >
      {children}
    </ConfirmDeleteDialog>
  );
}

export const DeleteCourseDialogTrigger = ConfirmDeleteDialogTrigger;

export default DeleteCourseDialog;
