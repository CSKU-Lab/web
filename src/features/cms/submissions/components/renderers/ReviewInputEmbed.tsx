"use client";

import { useQuery } from "@tanstack/react-query";
import { FormInput, CheckCircle2, XCircle } from "lucide-react";
import { cmsMaterialService } from "~/services/cms-material.service";

interface Props {
  courseID: string;
  documentMaterialID: string;
  nodeID: string;
  label: string;
  score: number;
  studentID: string;
}

/**
 * Read-only view of an input embed for the instructor submission review:
 * renders the selected student's submitted value, pass/fail and earned score.
 */
export function ReviewInputEmbed({
  courseID,
  documentMaterialID,
  nodeID,
  label,
  score,
  studentID,
}: Props) {
  const { data } = useQuery({
    queryKey: ["cms-input-submissions", courseID, documentMaterialID],
    queryFn: () =>
      cmsMaterialService.getInputSubmissions(courseID, documentMaterialID),
    enabled: !!courseID && !!documentMaterialID,
  });

  // Latest submitted value for this node by the selected student.
  const result = data
    ?.filter((s) => s.user_id === studentID && s.node_id === nodeID)
    .at(-1);

  return (
    <div className="flex items-center justify-between gap-3 border rounded-lg p-3 bg-(--gray-2) my-2">
      <div className="flex items-center gap-2 min-w-0">
        <FormInput size="1rem" className="text-(--gray-10) shrink-0" />
        <span className="text-sm font-medium text-(--gray-12) truncate">
          {label || "Input Field"}
        </span>
        {result ? (
          <>
            <code className="text-xs font-mono text-(--gray-11) truncate max-w-[16rem]">
              {result.value || "(empty)"}
            </code>
            {result.passed ? (
              <CheckCircle2 size="0.875rem" className="text-(--grass-11) shrink-0" />
            ) : (
              <XCircle size="0.875rem" className="text-(--tomato-11) shrink-0" />
            )}
          </>
        ) : (
          <span className="text-xs text-(--gray-10)">Not submitted</span>
        )}
      </div>
      <span className="text-sm font-medium text-(--gray-11) shrink-0">
        {result ? result.score : "—"} / {score} pts
      </span>
    </div>
  );
}
