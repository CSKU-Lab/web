import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import ConfirmDeleteDialog, { ConfirmDeleteDialogTrigger } from "~/components/crafts/ConfirmDeleteDialog/index";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { queryKeys } from "~/queryKeys";
import { cmsSemesterService } from "~/services/cms-semester.service";
import type { ChildrenProps } from "~/types/children-props";
import type { CMSSemester } from "~/types/cms-semester";

interface Props extends ChildrenProps {
  semester: CMSSemester;
}

function DeleteSemesterDialog({ semester, children }: Props) {
  const queryClient = useQueryClient();

  const deleteSemester = useMutation({
    mutationFn: () => cmsSemesterService.delete(semester.id),
    onSuccess: async () => {
      toast.success("Semester deleted successfully");
      await queryClient.refetchQueries({ queryKey: queryKeys.semester.all });
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
      confirmText={semester.name + "/" + semester.type}
      entitiyDetail={
        <div className="flex gap-8">
          <div>
            <h6 className="text-xs text-(--gray-11)">Name</h6>
            <h5>{semester.name}</h5>
          </div>
          <div>
            <h6 className="text-xs text-(--gray-11)">Type</h6>
            <h5>{semester.type}</h5>
          </div>
          <div>
            <h6 className="text-xs text-(--gray-11)">Started Date</h6>
            <h5>{dateFormatter(semester.started_date)}</h5>
          </div>
        </div>
      }
      type="semester"
      id={semester.id}
      onConfirm={deleteSemester.mutate}
    >
      {children}
    </ConfirmDeleteDialog>
  );
}

export const DeleteSemesterDialogTrigger = ConfirmDeleteDialogTrigger;

export default DeleteSemesterDialog;
