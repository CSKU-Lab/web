"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormInput, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { cmsMaterialService } from "~/services/cms-material.service";
import type { InputEmbedMode } from "~/components/tiptap-node/input-embed-node/input-embed-node-extension";

interface Props {
  courseID: string;
  documentMaterialID: string;
  nodeID: string;
  label: string;
  mode: InputEmbedMode;
  score: number;
  studentID: string;
}

/**
 * Read-only view of an input embed for the instructor submission review:
 * renders the selected student's submitted value, pass/fail and earned score.
 * For manual-mode inputs it also exposes a score field so the instructor can
 * grade the pending submission by hand.
 */
export function ReviewInputEmbed({
  courseID,
  documentMaterialID,
  nodeID,
  label,
  mode,
  score,
  studentID,
}: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["cms-input-submissions", courseID, documentMaterialID];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      cmsMaterialService.getInputSubmissions(courseID, documentMaterialID),
    enabled: !!courseID && !!documentMaterialID,
  });

  // Latest submitted value for this node by the selected student.
  const result = data
    ?.filter((s) => s.user_id === studentID && s.node_id === nodeID)
    .at(-1);

  const isManual = mode === "manual";

  return (
    <span className="inline-flex items-center gap-1.5 border rounded-md px-1.5 py-0.5 bg-(--gray-2) align-middle">
      <FormInput size="0.875rem" className="text-(--gray-10) shrink-0" />
      {label && (
        <span className="text-xs font-medium text-(--gray-12) truncate max-w-[10rem]">
          {label}
        </span>
      )}
      {result ? (
        <>
          <code className="text-xs font-mono text-(--gray-11) truncate max-w-[12rem]">
            {result.value || "(empty)"}
          </code>
          {isManual && !result.graded ? (
            <Clock size="0.875rem" className="text-(--blue-11) shrink-0" />
          ) : result.passed ? (
            <CheckCircle2 size="0.875rem" className="text-(--grass-11) shrink-0" />
          ) : (
            <XCircle size="0.875rem" className="text-(--tomato-11) shrink-0" />
          )}
        </>
      ) : (
        <span className="text-xs text-(--gray-10)">Not submitted</span>
      )}

      {isManual && result ? (
        <ManualGradeField
          courseID={courseID}
          documentMaterialID={documentMaterialID}
          submissionID={result.id}
          maxScore={score}
          currentScore={result.graded ? result.score : null}
          onGraded={() => queryClient.invalidateQueries({ queryKey })}
        />
      ) : (
        <span className="text-xs font-medium text-(--gray-11) shrink-0">
          {result ? result.score : "—"} / {score} pts
        </span>
      )}
    </span>
  );
}

interface ManualGradeFieldProps {
  courseID: string;
  documentMaterialID: string;
  submissionID: string;
  maxScore: number;
  currentScore: number | null;
  onGraded: () => void;
}

function ManualGradeField({
  courseID,
  documentMaterialID,
  submissionID,
  maxScore,
  currentScore,
  onGraded,
}: ManualGradeFieldProps) {
  const [value, setValue] = useState(
    currentScore !== null ? String(currentScore) : "",
  );

  const gradeMutation = useMutation({
    mutationFn: (score: number) =>
      cmsMaterialService.gradeInputSubmission(
        courseID,
        documentMaterialID,
        submissionID,
        score,
      ),
    onSuccess: () => {
      toast.success("Score saved");
      onGraded();
    },
    onError: () => toast.error("Failed to save score"),
  });

  const handleSave = () => {
    const score = Number(value);
    if (Number.isNaN(score) || score < 0 || score > maxScore) {
      toast.error(`Score must be between 0 and ${maxScore}`);
      return;
    }
    gradeMutation.mutate(score);
  };

  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      <Input
        type="number"
        min={0}
        max={maxScore}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
        }}
        placeholder="—"
        className="h-6 w-12 px-1 py-0 text-center text-xs"
      />
      <span className="text-xs text-(--gray-11)">/ {maxScore}</span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleSave}
        disabled={gradeMutation.isPending}
        className="h-6 px-2 text-xs"
      >
        {gradeMutation.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          "Save"
        )}
      </Button>
    </span>
  );
}
