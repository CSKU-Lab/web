"use client";

import PageTitle from "~/components/commons/PageTitle";
import { Button } from "~/components/commons/Button";
import { useMutation } from "@tanstack/react-query";
import {
  cmsLabService,
  type CreateLabPayload,
} from "~/services/cms-lab.service";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Label from "~/components/commons/Label";
import Input from "~/components/commons/Input";
import {
  CreateLabSchema,
  createLabSchema,
} from "./_schemas/create-section.schema";

export default function NewLabPage() {
  const form = useForm({
    resolver: zodResolver(createLabSchema),
    defaultValues: {
      display_name: "",
    },
  });

  const router = useRouter();
  const { courseID } = useParams<{ courseID: string }>();

  const createLab = useMutation({
    mutationFn: (payload: CreateLabPayload) => cmsLabService.create(payload),

    onSuccess: (labID) => {
      toast.success("Lab created successfully");
      router.push(`/cms/courses/${courseID}/labs/`);
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

  const handleCreateLab = async (data: CreateLabSchema) => {
    createLab.mutate({
      displayName: data.display_name,
      courseID: courseID!,
    });
  };

  return (
    <div>
      <PageTitle>Create a lab</PageTitle>

      <form
        onSubmit={form.handleSubmit(handleCreateLab)}
        className="p-4 space-y-4 h-full"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">Detail</h5>
            <p className="text-sm text-(--gray-10)">
              Provide basic information about this lab.
            </p>
            <hr />
          </div>
        </div>
        <Label className="gap-0" isError={!!form.formState.errors.display_name}>
          Display Name <span className="text-(--red-9)">*</span>
        </Label>
        <div>
          <Input
            isError={!!form.formState.errors.display_name}
            placeholder="e.g. Python - Control flow statements"
            {...form.register("display_name")}
          />
          <p className="text-xs mt-1 text-(--red-9)">
            {form.formState.errors.display_name?.message}
          </p>
        </div>
        <Button type="submit" className="mt-8" variant="action">
          Create
        </Button>
      </form>
    </div>
  );
}
