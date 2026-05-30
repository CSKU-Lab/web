"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { z } from "zod";
import InlineError from "~/components/commons/InlineError";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { Button } from "~/components/commons/Button";
import PageTitle from "~/components/commons/PageTitle";
import { cmsRunnerService } from "~/services/cms-runner.service";
import { cn } from "~/lib/utils";

const createRunnerSchema = z.object({
  name: z.string().min(1, "Runner name is required"),
  description: z.string(),
});

type CreateRunnerForm = z.infer<typeof createRunnerSchema>;

function NewRunnerView() {
  const form = useForm<CreateRunnerForm>({
    resolver: zodResolver(createRunnerSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: CreateRunnerForm) =>
      await cmsRunnerService.create({
        name: data.name,
        description: data.description,
      }),
    onSuccess: (res) => {
      toast.success("Runner created successfully!");
      router.push(`/cms/runners/${res.id}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.error || "Failed to create runner";
        form.setError("name", { message: errorMessage });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <div>
      <PageTitle>New Runner</PageTitle>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="md:w-4/5 mt-4 space-y-10 p-4"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">General</h5>
            <p className="text-sm text-(--gray-10)">
              Fill in the basic details of your runner.
            </p>
            <hr />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Python 3.11, GCC 13, Node.js 20"
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
              placeholder="A brief description of what this runner does..."
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
              Default build and run scripts will be created. You can customize
              them after creation.
            </p>
            <hr />
          </div>
          <div className="rounded-md border border-(--gray-4) bg-(--gray-2) p-4">
            <p className="text-sm text-(--gray-11)">
              The runner will be created with default template scripts for:
            </p>
            <ul className="mt-2 text-sm text-(--gray-11) list-disc list-inside space-y-1">
              <li>
                <code className="text-xs bg-(--gray-4) px-1 py-0.5 rounded">
                  scripts/build.sh
                </code>{" "}
                - Compilation script
              </li>
              <li>
                <code className="text-xs bg-(--gray-4) px-1 py-0.5 rounded">
                  scripts/run.sh
                </code>{" "}
                - Execution script
              </li>
            </ul>
          </div>
        </div>

        <Button type="submit" variant="action" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Runner"}
        </Button>
      </form>
    </div>
  );
}

export default NewRunnerView;
