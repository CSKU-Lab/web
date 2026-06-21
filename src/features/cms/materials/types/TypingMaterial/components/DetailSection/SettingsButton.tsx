"use client";

import { Info, Settings } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";

const EXAM_FORMULA = `/*
 * evaluate typing score from adjust_speed and %error
 */
function evaluate(adj: number, error: number) {
  const MAX_SCORE = 100.0;
  const ADJ_WEIGHT = 0.7;
  const ERROR_WEIGHT = 0.3;
  const ADJ_THRESHOLD = 30.0;
  const ERROR_THRESHOLD = 3.0;
  const MIN_ADJ = 10.0;
  const MAX_ERROR = 12.0;

  if (adj >= ADJ_THRESHOLD && error <= ERROR_THRESHOLD)
    return MAX_SCORE;

  let adj_score = 0.0;
  if (adj >= MIN_ADJ && adj < ADJ_THRESHOLD)
    adj_score = (adj / ADJ_THRESHOLD) * (MAX_SCORE * ADJ_WEIGHT);
  else if (adj >= ADJ_THRESHOLD)
    adj_score = MAX_SCORE * ADJ_WEIGHT;

  let error_score = 0.0;
  if (error <= ERROR_THRESHOLD)
    error_score = MAX_SCORE * ERROR_WEIGHT;
  else if (error <= MAX_ERROR)
    error_score =
      ((MAX_ERROR - error) / (MAX_ERROR - ERROR_THRESHOLD)) *
      (MAX_SCORE * ERROR_WEIGHT);

  return parseFloat((adj_score + error_score).toFixed(2));
}`;

function FormulaCode() {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const isDark = document.documentElement.classList.contains("dark");
    const theme = isDark ? "github-dark" : "github-light";
    import("shiki").then(({ codeToHtml }) =>
      codeToHtml(EXAM_FORMULA, { lang: "typescript", theme }).then((result) => {
        if (!cancelled) setHtml(result);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!html) {
    return (
      <pre className="px-3 pb-3 text-xs font-mono whitespace-pre leading-relaxed overflow-auto max-h-72 text-(--gray-12)">
        {EXAM_FORMULA}
      </pre>
    );
  }

  return (
    <div
      className="px-3 pb-3 text-xs overflow-auto max-h-72 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!text-xs [&_code]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const settingsSchema = z.object({
  name: z.string().min(1, "Material name is required"),
  tags: z.array(z.object({ id: z.string(), display: z.string() })),
  visibility: z.enum(["public", "private"]),
  manual_score: z
    .number()
    .int("Manual score must be an integer")
    .min(0, "Manual score must be non-negative"),
  typing_type: z.enum(["practice", "exam"]),
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

  const typingPayload = material?.payload as
    | { typing_type?: "practice" | "exam" }
    | undefined;

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
      manual_score: material?.manual_score ?? 0,
      typing_type: typingPayload?.typing_type ?? "practice",
    },
    values: {
      name: material?.name || "",
      tags:
        material?.tags.map((tag, index) => ({
          id: index.toString(),
          display: tag,
        })) || [],
      visibility: material?.visibility || "public",
      manual_score: material?.manual_score ?? 0,
      typing_type: typingPayload?.typing_type ?? "practice",
    },
  });

  const updateMaterial = useMutation({
    mutationFn: (payload: {
      name: string;
      tags: string[];
      visibility: "public" | "private";
      manual_score: number;
      typing_type: "practice" | "exam";
    }) =>
      cmsMaterialService.update(courseID, materialID, {
        name: payload.name,
        tags: payload.tags,
        visibility: payload.visibility,
        manual_score: payload.manual_score,
        payload: { typing_type: payload.typing_type },
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
      manual_score: data.manual_score,
      typing_type: data.typing_type,
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
              <h5 className="text-xl font-medium">Typing Type</h5>
              <p className="text-sm text-(--gray-10)">
                Set how this material is graded for students.
              </p>
              <hr />
            </div>
            <Controller
              control={form.control}
              name="typing_type"
              render={({ field: { value, onChange } }) => (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onChange("practice")}
                    className={cn(
                      "flex flex-col items-start gap-1.5 rounded-lg border p-4 text-left transition-colors",
                      value === "practice"
                        ? "border-(--accent-8) bg-(--accent-2) text-(--accent-11)"
                        : "border-(--gray-6) bg-(--gray-1) hover:border-(--gray-8)",
                    )}
                  >
                    <span className="font-semibold text-sm">Practice</span>
                    <span className="text-xs text-(--gray-10)">
                      Unlimited attempts. No grade recorded. Students get WPM
                      and accuracy feedback only.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange("exam")}
                    className={cn(
                      "relative flex flex-col items-start gap-1.5 rounded-lg border p-4 text-left transition-colors",
                      value === "exam"
                        ? "border-(--accent-8) bg-(--accent-2) text-(--accent-11)"
                        : "border-(--gray-6) bg-(--gray-1) hover:border-(--gray-8)",
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-sm">Exam</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <span
                            role="button"
                            onClick={(e) => e.stopPropagation()}
                            className="text-(--gray-9) hover:text-(--gray-12) transition-colors"
                          >
                            <Info size="0.875rem" />
                          </span>
                        </PopoverTrigger>
                        <PopoverContent
                          side="bottom"
                          align="end"
                          className="w-auto max-w-sm p-0 overflow-hidden"
                        >
                          <p className="px-3 pt-2.5 pb-1 text-xs font-medium text-(--gray-11)">
                            Scoring Formula
                          </p>
                          <FormulaCode />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <span className="text-xs text-(--gray-10)">
                      Unlimited attempts. Best score saved as grade. Score
                      calculated from speed and accuracy.
                    </span>
                  </button>
                </div>
              )}
            />

            <div className="space-y-1.5 mt-6">
              <h5 className="text-xl font-medium">Visibility</h5>
              <p className="text-sm text-(--gray-10)">
                Choose who can see this material.
              </p>
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
