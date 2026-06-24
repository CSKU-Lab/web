"use client";

import { RotateCcw, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "~/components/commons/Button";
import type { TypingResults } from "~/features/core/materials/components/TypingSection/useTypingTest";

interface Props {
  results: TypingResults;
  onRestart: () => void;
  onViewSubmissions?: () => void;
  isSubmitting?: boolean;
  submitError?: Error | null;
  isSubmitted?: boolean;
}

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 bg-(--gray-2) border border-(--gray-4) rounded-lg p-6 min-w-[140px]">
      <span className="text-xs uppercase tracking-widest text-(--gray-9) font-mono">{label}</span>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold text-(--gray-12) font-mono">{value}</span>
        {unit && <span className="text-sm text-(--gray-10) mb-1">{unit}</span>}
      </div>
    </div>
  );
}

function SubmissionStatus({
  isSubmitting,
  submitError,
  isSubmitted,
}: {
  isSubmitting: boolean;
  submitError: Error | null;
  isSubmitted: boolean;
}) {
  if (isSubmitting) {
    return (
      <div className="flex items-center gap-2 text-(--amber-9)">
        <Loader2 size="1rem" className="animate-spin" />
        <span className="text-sm font-medium">Submitting...</span>
      </div>
    );
  }

  if (submitError) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <AlertCircle size="1rem" />
        <span className="text-sm font-medium">
          {submitError.message || "Submission failed"}
        </span>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle2 size="1rem" />
        <span className="text-sm font-medium">Submitted successfully!</span>
      </div>
    );
  }

  return null;
}

export default function ResultsOverlay({
  results,
  onRestart,
  onViewSubmissions,
  isSubmitting = false,
  submitError = null,
  isSubmitted = false,
}: Props) {
  const accuracy = (100 - results.errorPct).toFixed(2);
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-xl font-semibold text-(--gray-12)">Results</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <StatCard label="Raw Speed" value={results.rawWPM.toFixed(2)} unit="wpm" />
        <StatCard label="Adjusted Speed" value={results.adjWPM.toFixed(2)} unit="wpm" />
        <StatCard label="Accuracy" value={`${accuracy}`} unit="%" />
        <StatCard label="Error Rate" value={results.errorPct.toFixed(2)} unit="%" />
        <StatCard label="Duration" value={results.duration} unit="s" />
      </div>

      <SubmissionStatus
        isSubmitting={isSubmitting}
        submitError={submitError}
        isSubmitted={isSubmitted}
      />

      <div className="flex items-center gap-3">
        <Button
          variant="action"
          onClick={onRestart}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 size="1rem" className="animate-spin" />
          ) : (
            <RotateCcw size="1rem" />
          )}
          {isSubmitting ? "Submitting..." : "Try Again"}
          {!isSubmitting && (
            <span className="text-xs opacity-50 font-mono ml-1">esc</span>
          )}
        </Button>
        {onViewSubmissions && (
          <Button variant="ghost" onClick={onViewSubmissions} disabled={isSubmitting}>
            View Submissions
          </Button>
        )}
      </div>
    </div>
  );
}
