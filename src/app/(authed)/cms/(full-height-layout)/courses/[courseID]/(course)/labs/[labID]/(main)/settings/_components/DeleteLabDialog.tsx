import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDeleteDialog, {
  ConfirmDeleteDialogTrigger,
} from "~/components/crafts/ConfirmDeleteDialog";
import { queryKeys } from "~/queryKeys";
import { cmsLabService } from "~/services/cms-lab.service";
import useResolvePath from "~/hooks/useResolvePath";
import useGetLab from "../../../_hooks/useGetLab";

interface Props {
  children: React.ReactNode;
}

function DeleteLabDialog({ children }: Props) {
  const queryClient = useQueryClient();
  const { labID } = useParams<{ labID: string }>();
  const { data: lab } = useGetLab({ labID });
  const generatePath = useResolvePath();

  const router = useRouter();
  const deleteLab = useMutation({
    mutationFn: () => cmsLabService.deleteById(labID),
    onSuccess: async () => {
      toast.success("Lab deleted successfully");
      await queryClient.refetchQueries({ queryKey: queryKeys.lab.all });
      router.push(generatePath("/cms/courses/:courseID/labs"));
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
      confirmText={lab!.display_name}
      type="lab"
      id={labID}
      onConfirm={deleteLab.mutate}
    >
      {children}
    </ConfirmDeleteDialog>
  );
}

export const DeleteLabDialogTrigger = ConfirmDeleteDialogTrigger;

export default DeleteLabDialog;
