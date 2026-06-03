import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { useUpdateManualScore } from "~/features/cms/submissions/hooks/useUpdateManualScore";

interface ManualScoreInputProps {
  submissionID: string;
  manualScore: number;
  maxScore: number;
  sectionId: string;
  labId: string;
  materialId: string;
}

// Manual score input with validation and save-on-blur/Enter. Shared across
// material submission renderers (code, typing, ...).
function ManualScoreInput({
  submissionID,
  manualScore,
  maxScore,
  sectionId,
  labId,
  materialId,
}: ManualScoreInputProps) {
  const [inputValue, setInputValue] = useState(String(manualScore ?? 0));
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateManualScore, isPending: isSaving } =
    useUpdateManualScore({
      sectionId,
      labId,
      materialId,
    });

  const handleSave = () => {
    const value = parseFloat(inputValue);

    // Clear previous error
    setError(null);

    // Validation: Check if valid number
    if (isNaN(value)) {
      setError("Please enter a valid number");
      toast.error("Please enter a valid number");
      return;
    }

    // Validation: Check if non-negative
    if (value < 0) {
      setError("Score must be non-negative");
      toast.error("Score must be non-negative");
      return;
    }

    // Validation: Check if exceeds maximum
    if (value > maxScore) {
      setError(`Score cannot exceed maximum of ${maxScore}`);
      toast.error(`Score cannot exceed maximum of ${maxScore}`);
      return;
    }

    // Only update if value has changed
    if (value !== manualScore) {
      updateManualScore({
        submissionID,
        score: value,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col">
        <Input
          id="manual-score"
          type="number"
          min={0}
          max={maxScore}
          step={1}
          className={cn(
            "w-20 h-7 text-sm",
            error && "border-red-500 focus-visible:ring-red-500",
          )}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null); // Clear error on change
          }}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
      <span className="text-sm text-(--gray-11)">/ {maxScore}</span>
      {isSaving && (
        <Loader2 size="0.875rem" className="animate-spin text-(--gray-9)" />
      )}
    </div>
  );
}

export default ManualScoreInput;
