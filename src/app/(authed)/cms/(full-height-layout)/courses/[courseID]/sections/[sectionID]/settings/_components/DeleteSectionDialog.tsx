import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDeleteDialog, {
  ConfirmDeleteDialogTrigger,
} from "~/components/crafts/ConfirmDeleteDialog/index";
import type { ChildrenProps } from "~/types/children-props";
import useGetSection from "../../_hooks/useGetSection";
import { cmsSectionService } from "~/services/cms-section.service";

function DeleteSectionDialog({ children }: ChildrenProps) {
  const { courseID, sectionID } = useParams<{
    courseID: string;
    sectionID: string;
  }>();
  const { data: section } = useGetSection();

  const router = useRouter();
  const deleteSemester = useMutation({
    mutationFn: () => cmsSectionService.deleteByID(sectionID),
    onSuccess: async () => {
      toast.success("Course deleted successfully");
      router.push(`/cms/courses/${courseID}`);
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
      confirmText={section?.name ?? ""}
      type="section"
      id={sectionID}
      onConfirm={deleteSemester.mutate}
    >
      {children}
    </ConfirmDeleteDialog>
  );
}

export const DeleteSectionDialogTrigger = ConfirmDeleteDialogTrigger;

export default DeleteSectionDialog;
