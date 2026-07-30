"use client";

import { useState } from "react";
import { ListChecks } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import TestcaseTable from "./TestcaseTable";
import type { TestCaseGroup } from "~/types/core-code-submission";

interface Props {
  groups?: TestCaseGroup[];
  isLoading?: boolean;
  // Instructor (CMS) view: shows the student's actual output + full messages and
  // per-group scores. Student side hides fields withheld by the creator.
  instructorView?: boolean;
  showGroupScore?: boolean;
  // Called whenever the dialog opens/closes. Student side uses this to lazily
  // fetch the submission detail only once the dialog is first opened.
  onOpenChange?: (open: boolean) => void;
}

/**
 * Icon button that opens a dialog listing the per-test-case results for a code
 * submission. Shared by the student (InlineCodeEditor) and instructor
 * (ReviewCodeEmbed) code-embed views so both can see which cases passed/failed.
 */
export function TestcaseDialog({
  groups,
  isLoading = false,
  instructorView = false,
  showGroupScore = false,
  onOpenChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="View test cases"
          className="p-1 rounded hover:bg-(--gray-4) text-(--gray-10) hover:text-(--gray-12) transition-colors"
        >
          <ListChecks size="0.875rem" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Cases</DialogTitle>
        </DialogHeader>
        <TestcaseTable
          isLoading={isLoading}
          groups={groups}
          instructorView={instructorView}
          showGroupScore={showGroupScore}
        />
      </DialogContent>
    </Dialog>
  );
}
