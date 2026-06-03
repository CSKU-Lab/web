"use client";

import { Type } from "lucide-react";
import type { TypingSubmissionData } from "~/types/cms-section-submission";

interface TypeContentProps {
  payload: TypingSubmissionData;
}

export function TypeContent({ payload }: TypeContentProps) {
  const accuracy = Math.round(100 - payload.error_rate);

  return (
    <div className="flex items-center gap-3 text-sm text-(--gray-11)">
      <Type size={18} className="text-(--gray-9) shrink-0" />
      <span className="font-mono">
        {Math.round(payload.adjusted_wpm)} WPM · {accuracy}% acc
      </span>
    </div>
  );
}
