"use client";

import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/commons/Dialog";
import useDeleteCompare from "../../hooks/useDeleteCompare";

function DeleteButton() {
  const { compareId } = useParams<{ compareId: string }>();
  const router = useRouter();
  const deleteCompare = useDeleteCompare();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteCompare.mutate(compareId, {
      onSuccess: () => {
        setOpen(false);
        router.push("/cms/compares");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="danger">
          <Trash2 size="1rem" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="p-4">
          <DialogTitle>Delete Compare</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-(--gray-11)">
            Are you sure you want to delete this compare? This action cannot be
            undone.
          </p>
        </div>
        <DialogFooter className="p-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteCompare.isPending}
          >
            {deleteCompare.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteButton;
