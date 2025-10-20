import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import UserProfileImage from "~/components/Menus/UserProfileImage";
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
import { userService } from "~/services/user.service";
import type { User } from "~/types/user";

interface Props {
  user: User;
  onClose: () => void;
}
function DeleteUserDialog({ user, onClose }: Props) {
  const { profile_image, username, display_name } = user;
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleOnDelete = async () => {
    try {
      setIsLoading(true);
      await userService.deleteUser(user.id);
      await queryClient.refetchQueries({ queryKey: queryKeys.user.all });
      toast.success("User deleted successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to delete user");
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
            Are you sure you want to delete these users? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto space-y-1.5">
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

export default DeleteUserDialog;
