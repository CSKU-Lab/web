"use client";

import { Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import Input from "~/components/crafts/Input";
import { queryKeys } from "~/queryKeys";
import { cmsRunnerService } from "~/services/cms-runner.service";
import useRunner from "../../_hooks/useRunner";
import {
  runnerNameAtom,
  runnerDescriptionAtom,
} from "../../_stores/runner-info.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { cn } from "~/lib/utils";
import { UpdateRunnerConfig } from "~/types/cms-runner";

const settingsSchema = z.object({
  name: z.string().min(1, "Runner name is required"),
  description: z.string().optional(),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

function SettingsButton() {
  const { runnerId } = useParams<{ runnerId: string }>();
  const queryClient = useQueryClient();
  const { data: runner } = useRunner(runnerId);

  const [, setName] = useAtom(runnerNameAtom);
  const [, setDescription] = useAtom(runnerDescriptionAtom);
  const [, setSaveStatus] = useAtom(saveStatusAtom);

  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: runner?.name || "",
      description: runner?.description || "",
    },
    values: {
      name: runner?.name || "",
      description: runner?.description || "",
    },
  });

  const updateRunner = useMutation({
    mutationFn: (payload: UpdateRunnerConfig) =>
      cmsRunnerService.updateById(runnerId, payload),
    onSuccess: () => {
      toast.success("Runner settings updated successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.runner.getById(runnerId),
      });
      // Update atoms with new values
      setName(form.getValues("name"));
      setDescription(form.getValues("description") || "");
      setSaveStatus("Saved");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error("Error", {
          description:
            err.response?.data?.error || "Failed to update runner settings",
        });
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (data: SettingsSchema) => {
    updateRunner.mutate({
      name: data.name,
      description: data.description,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Settings size="1rem" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="p-4">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="p-4 space-y-4"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h5 className="text-xl font-medium">Detail</h5>
              <p className="text-sm text-(--gray-10)">
                Update basic information about this runner.
              </p>
              <hr />
            </div>
          </div>
          <Input
            label="Name"
            placeholder="e.g., Python 3.11"
            {...form.register("name")}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description{" "}
              <span className="text-xs text-(--gray-11)">(optional)</span>
            </label>
            <textarea
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

          <Button
            type="submit"
            className="mt-8"
            variant="action"
            disabled={updateRunner.isPending}
          >
            {updateRunner.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsButton;
