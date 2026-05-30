import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { queryKeys } from "~/queryKeys";
import { cmsSectionService } from "~/services/cms-section.service";
import type { Student } from "~/types/cms-section";

interface Props {
  student: Student;
}

function DeleteButton({ student }: Props) {
  const { id, username, display_name, profile_image } = student;

  const { sectionID } = useParams<{ sectionID: string }>();
  const queryClient = useQueryClient();
  const removeStudent = useMutation({
    mutationFn: () => cmsSectionService.removeStudents(sectionID, [id]),
    onSuccess: () => {
      toast.success(
        `"${display_name}" has been removed from the section successfully`,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.section.getStudents(sectionID),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", { description: err.response?.data.error });
      }
    },
  });

  return (
    <Dialog>
      <div className="flex justify-center pb-4 mt-4">
        <DialogTrigger asChild>
          <Button variant="danger">
            <Trash size="1rem" /> Remove
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>Confirm Remove ?</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {display_name} ? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto space-y-1.5 p-4">
          <div className="flex items-center gap-2.5">
            <UserProfileImage src={profile_image} username={username} />
            <span className="text-sm text-(--gray-12)">{display_name}</span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="danger">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={removeStudent.mutate}
            className="w-full"
            variant="primary"
          >
            <Trash size="1rem" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteButton;
