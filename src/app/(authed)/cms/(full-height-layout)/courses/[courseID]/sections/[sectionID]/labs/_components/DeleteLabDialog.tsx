import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import ConfirmDeleteDialog, {
  ConfirmDeleteDialogTrigger,
} from "~/components/crafts/ConfirmDeleteDialog/index";
import type { CMSSectionLab } from "~/types/cms-section-lab";
import { cmsSectionService } from "~/services/cms-section.service";
import { queryKeys } from "~/queryKeys";

interface DeleteLabDialogProps {
  lab: CMSSectionLab;
  sectionID: string;
  children: React.ReactNode;
}

function DeleteLabDialog({ lab, sectionID, children }: DeleteLabDialogProps) {
  const queryClient = useQueryClient();

  const deleteLab = useMutation({
    mutationFn: () => cmsSectionService.removeLabs(sectionID, [lab.lab_id]),
    onSuccess: async () => {
      toast.success("Lab removed successfully");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.labs.all(sectionID),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response?.data?.error);
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <ConfirmDeleteDialog
      confirmText={lab.lab_name}
      type="lab_section"
      id={lab.id}
      onConfirm={deleteLab.mutate}
    >
      {children}
    </ConfirmDeleteDialog>
  );
}

export const DeleteLabDialogTrigger = ConfirmDeleteDialogTrigger;

export default DeleteLabDialog;
