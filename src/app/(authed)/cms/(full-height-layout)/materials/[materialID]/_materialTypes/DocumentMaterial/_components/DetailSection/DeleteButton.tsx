"use client";

import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/commons/Dialog";
import { cmsMaterialService } from "~/services/cms-material.service";
import { isOwnerAtom } from "../../_stores/owner.store";

function DeleteButton() {
  const { courseID, materialID } = useParams<{
    courseID: string;
    materialID: string;
  }>();
  const router = useRouter();
  const isOwner = useAtomValue(isOwnerAtom);
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => cmsMaterialService.delete(courseID, materialID),
    onSuccess: () => {
      toast.success("Material deleted");
      setOpen(false);
      router.push(`/cms/courses/${courseID}/materials`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error("Error", {
          description: err.response?.data.error || "Failed to delete material",
        });
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  if (!isOwner) return null;

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
          <DialogTitle>Delete Material</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-(--gray-11)">
            Are you sure you want to delete this material? This action cannot be
            undone.
          </p>
        </div>
        <DialogFooter className="p-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteButton;
