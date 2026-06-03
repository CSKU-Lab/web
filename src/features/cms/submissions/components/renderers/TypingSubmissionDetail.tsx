import { useState } from "react";
import { CircleDashed, ChevronDown, ChevronRight, Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import type { TypingSubmissionData } from "~/types/cms-section-submission";
import { CMSMaterial } from "~/types/cms-material";
import ManualScoreInput from "~/features/cms/submissions/components/renderers/ManualScoreInput";

interface TypingSubmissionDetailProps {
  id: string;
  material: CMSMaterial;
  created_at: string;
  payload: TypingSubmissionData | null;
  auto_score: number;
  manual_score: number;
}

interface ThresholdBadgeProps {
  label: string;
  passed: boolean;
}

function ThresholdBadge({ label, passed }: ThresholdBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        passed ? "text-(--grass-11)" : "text-(--tomato-11)",
      )}
    >
      {passed ? <Check size="0.75rem" /> : <X size="0.75rem" />}
      {label}
    </span>
  );
}

function TypingSubmissionDetail({
  id,
  material,
  created_at,
  payload,
  auto_score,
  manual_score,
}: TypingSubmissionDetailProps) {
  const params = useParams();
  const sectionId = params.sectionID as string;
  const labId = params.labID as string;
  const materialId = params.materialID as string;

  const [isTargetOpen, setTargetOpen] = useState(false);

  if (payload === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 text-(--gray-11)">
        <CircleDashed size="2rem" />
        <span className="text-sm">No submission data available.</span>
      </div>
    );
  }

  const accuracy = 100 - payload.error_rate;

  // Material thresholds for auto-scoring. A threshold of 0 means "no minimum".
  const minAdjWpm = (material.payload.min_adj_wpm as number | undefined) ?? 0;
  const minAccuracy = (material.payload.min_accuracy as number | undefined) ?? 0;
  const passedWpm = payload.adjusted_wpm >= minAdjWpm;
  const passedAccuracy = accuracy >= minAccuracy;
  const hasThresholds = minAdjWpm > 0 || minAccuracy > 0;

  const targetText = (material.payload.content as string | undefined) ?? "";

  const stats = [
    { label: "Raw WPM", value: Math.round(payload.raw_wpm) },
    { label: "Adj WPM", value: Math.round(payload.adjusted_wpm) },
    { label: "Accuracy", value: `${Math.round(accuracy)}%` },
    { label: "Error Rate", value: `${payload.error_rate.toFixed(1)}%` },
    { label: "Duration", value: `${Math.round(payload.duration)}s` },
  ];

  return (
    <div className="p-4 pt-0 space-y-4 overflow-auto">
      <div className="flex items-center justify-between mt-4">
        <h6 className="text-sm font-semibold text-(--gray-11)">Submission</h6>
        <span className="text-xs text-(--gray-9)">
          Submitted: {new Date(created_at).toLocaleString()}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 bg-(--gray-2) rounded-lg px-4 py-3"
          >
            <span className="text-xs text-(--gray-9) uppercase tracking-wider font-mono">
              {label}
            </span>
            <span className="text-2xl font-bold text-(--gray-12) font-mono">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Scores */}
      <div className="flex items-center gap-6 p-3 bg-(--gray-3) rounded-lg flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-(--gray-11)">
            Auto Score:
          </Label>
          <span className="text-sm font-semibold text-(--gray-12)">
            {auto_score} / {material.auto_score}
          </span>
          {hasThresholds && (
            <span className="flex items-center gap-3 ml-1">
              {minAdjWpm > 0 && (
                <ThresholdBadge label={`≥${minAdjWpm} wpm`} passed={passedWpm} />
              )}
              {minAccuracy > 0 && (
                <ThresholdBadge
                  label={`≥${minAccuracy}%`}
                  passed={passedAccuracy}
                />
              )}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="manual-score"
            className="text-xs font-medium text-(--gray-11)"
          >
            Manual Score:
          </Label>
          <ManualScoreInput
            submissionID={id}
            manualScore={manual_score}
            maxScore={material.manual_score}
            sectionId={sectionId}
            labId={labId}
            materialId={materialId}
          />
        </div>
      </div>

      {/* Target text */}
      {targetText && (
        <div className="space-y-1">
          <button
            type="button"
            className="flex items-center justify-between w-full text-sm font-semibold text-(--gray-11)"
            onClick={() => setTargetOpen((prev) => !prev)}
          >
            <span>Target text</span>
            {isTargetOpen ? (
              <ChevronDown size="1rem" className="text-(--gray-9)" />
            ) : (
              <ChevronRight size="1rem" className="text-(--gray-9)" />
            )}
          </button>
          {isTargetOpen && (
            <pre className="max-h-80 overflow-auto p-3 bg-(--gray-2) border border-(--gray-4) rounded-md text-sm font-mono whitespace-pre-wrap text-(--gray-12)">
              {targetText}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default TypingSubmissionDetail;
