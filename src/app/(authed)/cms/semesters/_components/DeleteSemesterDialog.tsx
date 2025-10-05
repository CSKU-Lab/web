import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import React, { useState } from "react";
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
} from "~/components/ui/dialog";
import { queryKeys } from "~/queryKeys";
import type { CMSSemester } from "~/types/cms-semester";

interface Props {
  semester: CMSSemester;
  onClose: () => void;
}
function DeleteSemeseterDialog({ semester, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleOnDelete = async () => {
    try {
      setIsLoading(true);
      await queryClient.refetchQueries({ queryKey: queryKeys.user.all });
      toast.success("Semester deleted successfully");
      onClose();
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response?.data?.error);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete ?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete semester? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto space-y-1.5"></div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="danger">
              Cancel
            </Button>
          </DialogClose>
          <Button
            {...{ isLoading }}
            onClick={handleOnDelete}
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

export default DeleteSemeseterDialog;
