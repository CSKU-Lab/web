"use client";

import { Type } from "lucide-react";
import type { TypingSubmissionData } from "~/types/cms-section-submission";

interface TypeContentProps {
  payload: TypingSubmissionData;
}

export function TypeContent({ payload }: TypeContentProps) {
  const accuracy = (100 - payload.error_rate).toFixed(2);

  return (
    <div className="flex items-center gap-3 text-sm text-(--gray-11)">
      <Type size={18} className="text-(--gray-9) shrink-0" />
      <span className="font-mono">
        {payload.adjusted_wpm.toFixed(2)} WPM · {accuracy}% acc
      </span>
    </div>
  );
}
