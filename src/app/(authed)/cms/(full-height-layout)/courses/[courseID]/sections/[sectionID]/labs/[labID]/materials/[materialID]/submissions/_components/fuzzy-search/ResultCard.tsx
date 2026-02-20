"use client";

import { useAtom } from "jotai";
import { cn } from "~/lib/utils";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";
import type { MaterialType } from "~/types/cms-material";
import type { FuseResultMatch } from "fuse.js";
import { selectedStudentIdAtom } from "../../_stores/selected-student.store";
import { fuzzySearchOpenAtom } from "../../_stores/fuzzy-search.store";
import { StudentBlock } from "./StudentBlock";
import { ContentBlock } from "./ContentBlock";

interface ResultCardProps {
  submission: CMSSectionStudentSubmission;
  materialType: MaterialType;
  matches: readonly FuseResultMatch[];
  isSelected: boolean;
}

export function ResultCard({
  submission,
  materialType,
  matches,
  isSelected,
}: ResultCardProps) {
  const [, setSelectedId] = useAtom(selectedStudentIdAtom);
  const [, setIsOpen] = useAtom(fuzzySearchOpenAtom);

  const handleClick = () => {
    setSelectedId(submission.student.id);
    setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left rounded-xl border-2 transition-all bg-white",
        "hover:border-(--gray-6)",
        isSelected
          ? "border-accent ring-2 ring-accent/20"
          : "border-(--gray-4)",
      )}
    >
      {/* Block 1: Student detail */}
      <div className="px-5 pt-4 pb-3">
        <StudentBlock submission={submission} matches={matches} />
      </div>

      {/* Block 2: Content */}
      <div className="px-5 pb-4 pt-3 border-t border-(--gray-4)">
        <ContentBlock
          submission={submission}
          materialType={materialType}
          matches={matches}
        />
      </div>
    </button>
  );
}
