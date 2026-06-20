import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDeleteDialog, {
  ConfirmDeleteDialogTrigger,
} from "~/components/crafts/ConfirmDeleteDialog/index";
import type { ChildrenProps } from "~/types/children-props";
import { cmsSectionService } from "~/services/cms-section.service";
import { queryKeys } from "~/queryKeys";
import { useGetSectionLab } from "~/features/cms/sections/hooks/lab-detail/useGetSectionLab";

function DeleteLabSectionDialog({ children }: ChildrenProps) {
  const { courseID, sectionID, labID } = useParams<{
    courseID: string;
    sectionID: string;
    labID: string;
  }>();

  const { data: lab } = useGetSectionLab({ sectionID, labID });

  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteLabSection = useMutation({
    mutationFn: () => cmsSectionService.removeLabs(sectionID, [labID]),
    onSuccess: async () => {
      toast.success("Lab removed from section successfully");
      router.push(`/cms/courses/${courseID}/sections/${sectionID}/labs`);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.labs.all(sectionID),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.error) {
        toast.error(err.response?.data?.error);
        return;
      }
      toast.error("Failed to remove lab from section");
    },
  });

  return (
    <ConfirmDeleteDialog
      confirmText={lab?.lab_name ?? ""}
      type="lab_section"
      displayName={lab?.lab_name}
      id={`${labID}:${sectionID}`}
      onConfirm={deleteLabSection.mutate}
    >
      {children}
    </ConfirmDeleteDialog>
  );
}

export const DeleteLabSectionDialogTrigger = ConfirmDeleteDialogTrigger;

export default DeleteLabSectionDialog;
