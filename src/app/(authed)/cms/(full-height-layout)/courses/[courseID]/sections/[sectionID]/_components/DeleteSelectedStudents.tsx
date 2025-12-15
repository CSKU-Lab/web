import { useAtomValue, useSetAtom } from "jotai";
import { Trash } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  clearSelectedStudentsAtom,
  selectedStudentAtom,
} from "../_stores/student-management.store";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsSectionService } from "~/services/cms-section.service";
import { useParams } from "next/navigation";
import { queryKeys } from "~/queryKeys";
import { toast } from "sonner";
import { AxiosError } from "axios";

function DeleteSelectedStudents() {
  const selectedStudents = useAtomValue(selectedStudentAtom);
  const clearSelectedStudents = useSetAtom(clearSelectedStudentsAtom);

  const selectedCount = selectedStudents.length;

  const { sectionID } = useParams<{ sectionID: string }>();
  const queryClient = useQueryClient();
  const removeStudents = useMutation({
    mutationFn: () =>
      cmsSectionService.removeStudents(
        sectionID,
        selectedStudents.map((s) => s.id),
      ),
    onSuccess: () => {
      toast.success(`${selectedStudents.length} Students has been removed successfully`);
      clearSelectedStudents();
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

  if (selectedCount === 0) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">
          <Trash size="1rem" />
          Delete {selectedCount} selected student{selectedCount > 1 ? "s" : ""}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>Confirm Remove ?</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove these students? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto space-y-1.5 p-4">
          {selectedStudents.map(({ display_name, profile_image, username }) => (
            <div key={username} className="flex items-center gap-2.5">
              <UserProfileImage src={profile_image} username={username} />
              <span className="text-sm text-(--gray-12)">{display_name}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="danger">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={removeStudents.mutate}
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

export default DeleteSelectedStudents;
