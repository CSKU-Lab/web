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
import SharedInput from "~/components/commons/Input";
import { queryKeys } from "~/queryKeys";
import { cmsCompareService } from "~/services/cms-compare.service";
import useCompare from "../../_hooks/useCompare";
import {
  compareNameAtom,
  compareDescriptionAtom,
  compareRunNameAtom,
} from "../../_stores/compare-info.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { cn } from "~/lib/utils";
import { UpdateCompareConfig } from "~/types/cms-compare";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const settingsSchema = z.object({
  name: z.string().min(1, "Compare name is required"),
  description: z.string().optional(),
  run_name: z.string().min(1, "Run name is required"),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

function SettingsButton() {
  const { compareId } = useParams<{ compareId: string }>();
  const queryClient = useQueryClient();
  const { data: compare } = useCompare(compareId);

  const [, setName] = useAtom(compareNameAtom);
  const [, setDescription] = useAtom(compareDescriptionAtom);
  const [, setRunName] = useAtom(compareRunNameAtom);
  const [, setSaveStatus] = useAtom(saveStatusAtom);

  // Extract file names from compare.files array
  const fileOptions = compare?.files.map((file) => file.name) ?? [];

  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: compare?.name || "",
      description: compare?.description || "",
      run_name: compare?.run_name || "",
    },
    values: {
      name: compare?.name || "",
      description: compare?.description || "",
      run_name: compare?.run_name || "",
    },
  });

  const updateCompare = useMutation({
    mutationFn: (payload: UpdateCompareConfig) =>
      cmsCompareService.updateById(compareId, payload),
    onSuccess: () => {
      toast.success("Compare settings updated successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.compare.getById(compareId),
      });
      // Update atoms with new values
      setName(form.getValues("name"));
      setDescription(form.getValues("description") || "");
      setRunName(form.getValues("run_name"));
      setSaveStatus("Saved");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error("Error", {
          description:
            err.response?.data?.error || "Failed to update compare settings",
        });
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (data: SettingsSchema) => {
    updateCompare.mutate({
      name: data.name,
      description: data.description,
      run_name: data.run_name,
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
                Update basic information about this compare.
              </p>
              <hr />
            </div>
          </div>
          <Input
            label="Name"
            placeholder="e.g., Python Compare"
            {...form.register("name")}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description{" "}
              <span className="text-xs text-(--gray-11)">(optional)</span>
            </label>
            <textarea
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

          {/* Run Name Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Run Name</label>
            <div className="flex gap-2">
              <Select
                value={form.watch("run_name")}
                onValueChange={(value) => form.setValue("run_name", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a file..." />
                </SelectTrigger>
                <SelectContent>
                  {fileOptions.length > 0 ? (
                    fileOptions.map((fileName) => (
                      <SelectItem key={fileName} value={fileName}>
                        {fileName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No files available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* Editable fallback input */}
            <SharedInput
              placeholder="Or enter custom run name..."
              {...form.register("run_name")}
              className="mt-2"
            />
            {form.formState.errors.run_name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.run_name.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-8"
            variant="action"
            disabled={updateCompare.isPending}
          >
            {updateCompare.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsButton;
