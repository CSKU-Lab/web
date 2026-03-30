"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { z } from "zod";
import InlineError from "~/components/commons/InlineError";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { Button } from "~/components/commons/Button";
import PageTitle from "~/components/commons/PageTitle";
import useCreateCompare from "../_hooks/useCreateCompare";
import { cn } from "~/lib/utils";
import type { CreateCompareConfig } from "~/types/cms-compare";

const createCompareSchema = z.object({
  name: z.string().min(1, "Compare name is required"),
  description: z.string(),
  build_script: z.string().min(1, "Build script is required"),
  run_script: z.string().min(1, "Run script is required"),
  run_name: z.string().min(1, "Run name is required"),
});

type CreateCompareForm = z.infer<typeof createCompareSchema>;

function NewComparePage() {
  const form = useForm<CreateCompareForm>({
    resolver: zodResolver(createCompareSchema),
    defaultValues: {
      name: "",
      description: "",
      build_script: "#!/bin/bash\n# Build script for compare\necho 'Building...'",
      run_script: "#!/bin/bash\n# Run script for compare\necho 'Running...'",
      run_name: "run",
    },
  });

  const router = useRouter();
  const createCompare = useCreateCompare();

  const onSubmit = async (data: CreateCompareForm) => {
    createCompare.mutate(
      {
        name: data.name,
        description: data.description,
        build_script: data.build_script,
        run_script: data.run_script,
        run_name: data.run_name,
        files: [],
      },
      {
        onSuccess: (res: { id: string }) => {
          router.push(`/cms/compares/${res.id}`);
        },
        onError: (err: unknown) => {
          if (err instanceof AxiosError) {
            const errorMessage =
              err.response?.data?.error || "Failed to create compare";
            form.setError("name", { message: errorMessage });
          }
        },
      }
    );
  };

  return (
    <div>
      <PageTitle>New Compare</PageTitle>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-4/5 mt-4 space-y-10 p-4"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">General</h5>
            <p className="text-sm text-(--gray-10)">
              Fill in the basic details of your compare.
            </p>
            <hr />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Python Compare, Java Diff"
              {...form.register("name")}
            />
            <InlineError isError={!!form.formState.errors.name}>
              {form.formState.errors.name?.message}
            </InlineError>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-xs text-(--gray-11)">(optional)</span>
            </Label>
            <textarea
              id="description"
              placeholder="A brief description of what this compare does..."
              rows={3}
              className={cn(
                "w-full rounded-md border border-(--gray-6) bg-(--gray-1) px-3 py-2 text-sm",
                "placeholder:text-(--gray-9) text-(--gray-12)",
                "focus:outline-none focus:ring-1 focus:ring-(--gray-8)",
                "resize-none",
              )}
              {...form.register("description")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">Scripts</h5>
            <p className="text-sm text-(--gray-10)">
              Define the build and run scripts for this compare.
            </p>
            <hr />
          </div>
          <div className="space-y-2">
            <Label htmlFor="run_name">Run Name</Label>
            <Input
              id="run_name"
              placeholder="e.g., run, execute, test"
              {...form.register("run_name")}
            />
            <InlineError isError={!!form.formState.errors.run_name}>
              {form.formState.errors.run_name?.message}
            </InlineError>
          </div>
          <div className="space-y-2">
            <Label htmlFor="build_script">Build Script</Label>
            <textarea
              id="build_script"
              placeholder="#!/bin/bash\n# Build script"
              rows={6}
              className={cn(
                "w-full rounded-md border border-(--gray-6) bg-(--gray-1) px-3 py-2 text-sm font-mono",
                "placeholder:text-(--gray-9) text-(--gray-12)",
                "focus:outline-none focus:ring-1 focus:ring-(--gray-8)",
                "resize-none",
              )}
              {...form.register("build_script")}
            />
            <InlineError isError={!!form.formState.errors.build_script}>
              {form.formState.errors.build_script?.message}
            </InlineError>
          </div>
          <div className="space-y-2">
            <Label htmlFor="run_script">Run Script</Label>
            <textarea
              id="run_script"
              placeholder="#!/bin/bash\n# Run script"
              rows={6}
              className={cn(
                "w-full rounded-md border border-(--gray-6) bg-(--gray-1) px-3 py-2 text-sm font-mono",
                "placeholder:text-(--gray-9) text-(--gray-12)",
                "focus:outline-none focus:ring-1 focus:ring-(--gray-8)",
                "resize-none",
              )}
              {...form.register("run_script")}
            />
            <InlineError isError={!!form.formState.errors.run_script}>
              {form.formState.errors.run_script?.message}
            </InlineError>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/cms/compares")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="action"
            disabled={createCompare.isPending}
          >
            {createCompare.isPending ? "Creating..." : "Create Compare"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewComparePage;
