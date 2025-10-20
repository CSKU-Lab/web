"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
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
  DialogTrigger,
} from "~/components/ui/dialog";

interface UserPreview {
  username: string;
  display_name: string;
  profile_image?: string | null;
}

interface Props {
  onConfirm: (() => Promise<void>) | (() => void);
  users: UserPreview[];
}

function DeleteManyUsersButton({ users, onConfirm }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOnConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="danger">
          <Trash size="1rem" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete ?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete these users? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto space-y-1.5">
          {users.map(({ display_name, profile_image, username }) => (
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
            {...{ isLoading }}
            onClick={handleOnConfirm}
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

export default DeleteManyUsersButton;
