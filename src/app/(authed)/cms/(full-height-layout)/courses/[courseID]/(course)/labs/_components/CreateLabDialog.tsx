"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Button } from "~/components/commons/Button";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { cmsLabService, type CreateLabPayload } from "~/services/cms-lab.service";
import { queryKeys } from "~/queryKeys";
import { createLabSchema, type CreateLabSchema } from "../_schemas/create-lab.schema";

export default function CreateLabDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { courseID } = useParams<{ courseID: string }>();

  const form = useForm<CreateLabSchema>({
    resolver: zodResolver(createLabSchema),
    defaultValues: {
      display_name: "",
    },
  });

  const createLab = useMutation({
    mutationFn: (payload: CreateLabPayload) => cmsLabService.create(payload),
    onSuccess: () => {
      toast.success("Lab created successfully");
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: queryKeys.lab.allWithParams({ course_id: courseID }),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error("Error", {
          description: err.response?.data.error || "Failed to create lab",
        });
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (data: CreateLabSchema) => {
    createLab.mutate({
      displayName: data.display_name,
      courseID: courseID!,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size="1rem" />
          New lab
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>Create a new lab</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="p-4 space-y-4"
        >
          <Label className="gap-0" isError={!!form.formState.errors.display_name}>
            Lab Name <span className="text-(--red-9)">*</span>
          </Label>
          <div>
            <Input
              isError={!!form.formState.errors.display_name}
              placeholder="e.g. Python - Control flow statements"
              autoFocus
              {...form.register("display_name")}
            />
            <p className="text-xs mt-1 text-(--red-9)">
              {form.formState.errors.display_name?.message}
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="action" isLoading={createLab.isPending}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}