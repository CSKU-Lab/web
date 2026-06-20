"use client";

import { Settings } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import Input from "~/components/crafts/Input";
import TagAutocomplete from "~/components/crafts/TagAutocomplete";
import VisibilityInput from "~/components/crafts/VisibilityInput";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsMaterialService } from "~/services/cms-material.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { queryKeys } from "~/queryKeys";
import useGetMaterial from "~/features/cms/materials/hooks/useGetMaterial";
import { useAtomValue } from "jotai";
import { isOwnerAtom } from "~/features/cms/materials/types/TypingMaterial/stores/owner.store";

const settingsSchema = z.object({
  name: z.string().min(1, "Material name is required"),
  tags: z.array(z.object({ id: z.string(), display: z.string() })),
  visibility: z.enum(["public", "private"]),
  auto_score: z.number().int("Auto score must be an integer").min(0, "Auto score must be non-negative"),
  manual_score: z
    .number()
    .int("Manual score must be an integer")
    .min(0, "Manual score must be non-negative"),
  min_adj_wpm: z.number().min(0, "Min WPM must be non-negative"),
  min_accuracy: z.number().min(0).max(100, "Accuracy must be between 0 and 100"),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

function SettingsButton() {
  const { courseID, materialID } = useParams<{
    courseID: string;
    materialID: string;
  }>();
  const queryClient = useQueryClient();
  const { data: material } = useGetMaterial();
  const isOwner = useAtomValue(isOwnerAtom);

  const typingPayload = material?.payload as { min_adj_wpm?: number; min_accuracy?: number } | undefined;

  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: material?.name || "",
      tags:
        material?.tags.map((tag, index) => ({
          id: index.toString(),
          display: tag,
        })) || [],
      visibility: material?.visibility || "public",
      auto_score: material?.auto_score ?? 0,
      manual_score: material?.manual_score ?? 0,
      min_adj_wpm: typingPayload?.min_adj_wpm ?? 0,
      min_accuracy: typingPayload?.min_accuracy ?? 0,
    },
    values: {
      name: material?.name || "",
      tags:
        material?.tags.map((tag, index) => ({
          id: index.toString(),
          display: tag,
        })) || [],
      visibility: material?.visibility || "public",
      auto_score: material?.auto_score ?? 0,
      manual_score: material?.manual_score ?? 0,
      min_adj_wpm: typingPayload?.min_adj_wpm ?? 0,
      min_accuracy: typingPayload?.min_accuracy ?? 0,
    },
  });

  const updateMaterial = useMutation({
    mutationFn: (payload: {
      name: string;
      tags: string[];
      visibility: "public" | "private";
      auto_score: number;
      manual_score: number;
      min_adj_wpm: number;
      min_accuracy: number;
    }) =>
      cmsMaterialService.update(courseID, materialID, {
        name: payload.name,
        tags: payload.tags,
        visibility: payload.visibility,
        auto_score: payload.auto_score,
        manual_score: payload.manual_score,
        payload: { min_adj_wpm: payload.min_adj_wpm, min_accuracy: payload.min_accuracy },
      }),
    onSuccess: () => {
      toast.success("Material updated successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.material.getById(courseID, materialID),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error("Error", {
          description: err.response?.data.error || "Failed to update material",
        });
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (data: SettingsSchema) => {
    updateMaterial.mutate({
      name: data.name,
      tags: data.tags.map((tag) => tag.display),
      visibility: data.visibility,
      auto_score: data.auto_score,
      manual_score: data.manual_score,
      min_adj_wpm: data.min_adj_wpm,
      min_accuracy: data.min_accuracy,
    });
  };

  if (!isOwner) return null;

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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
        <DialogBody className="p-4 space-y-4">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">Detail</h5>
            <p className="text-sm text-(--gray-10)">
              Update basic information about this material.
            </p>
            <hr />
          </div>
          <Input
            label="Name"
            placeholder="(e.g.) Typing practice"
            {...form.register("name")}
          />
          <div>
            <h4 className="mb-4 text-sm">
              Tags <span className="text-xs text-(--gray-11)">(optional)</span>
            </h4>
            <Controller
              control={form.control}
              name="tags"
              render={({ field: { value, onChange } }) => (
                <TagAutocomplete value={value} onChange={onChange} />
              )}
            />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm">Manual Score</h4>
            <p className="text-xs text-(--gray-10)">
              Maximum points available for manual grading
            </p>
            <input
              type="number"
              min="0"
              step="1"
              className="w-full rounded-md border border-(--gray-7) bg-(--gray-1) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-8)"
              placeholder="0"
              {...form.register("manual_score", { valueAsNumber: true })}
            />
            {form.formState.errors.manual_score && (
              <p className="text-xs text-red-500">
                {form.formState.errors.manual_score.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 mt-6">
            <h5 className="text-xl font-medium">Scoring</h5>
            <p className="text-sm text-(--gray-10)">
              Award points when students meet WPM and accuracy targets. Leave thresholds at 0 to award points for any completed attempt.
            </p>
            <hr />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm">Auto Score</h4>
            <p className="text-xs text-(--gray-10)">Points awarded when thresholds are met (0 = no auto scoring)</p>
            <input
              type="number"
              min="0"
              step="1"
              className="w-full rounded-md border border-(--gray-7) bg-(--gray-1) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-8)"
              placeholder="0"
              {...form.register("auto_score", { valueAsNumber: true })}
            />
            {form.formState.errors.auto_score && (
              <p className="text-xs text-red-500">{form.formState.errors.auto_score.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <h4 className="text-sm">Min. Adj. WPM</h4>
              <p className="text-xs text-(--gray-10)">0 = no minimum</p>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full rounded-md border border-(--gray-7) bg-(--gray-1) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-8)"
                placeholder="0"
                {...form.register("min_adj_wpm", { valueAsNumber: true })}
              />
              {form.formState.errors.min_adj_wpm && (
                <p className="text-xs text-red-500">{form.formState.errors.min_adj_wpm.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm">Min. Accuracy %</h4>
              <p className="text-xs text-(--gray-10)">0 = no minimum</p>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                className="w-full rounded-md border border-(--gray-7) bg-(--gray-1) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-8)"
                placeholder="0"
                {...form.register("min_accuracy", { valueAsNumber: true })}
              />
              {form.formState.errors.min_accuracy && (
                <p className="text-xs text-red-500">{form.formState.errors.min_accuracy.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 mt-6">
            <h5 className="text-xl font-medium">Visibility</h5>
            <p className="text-sm text-(--gray-10)">Choose who can see this material.</p>
            <hr />
          </div>
          <Controller
            control={form.control}
            name="visibility"
            render={({ field: { value, onChange } }) => (
              <VisibilityInput
                value={value}
                onChange={onChange}
                publicText="Every Instructors can see this material"
                privateText="Only you can see this material"
              />
            )}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            type="submit"
            variant="action"
            disabled={updateMaterial.isPending}
          >
            {updateMaterial.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsButton;
