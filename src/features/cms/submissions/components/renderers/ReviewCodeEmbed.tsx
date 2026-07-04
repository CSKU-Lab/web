"use client";

import { useQuery } from "@tanstack/react-query";
import { Code2, CheckCircle2, XCircle, Loader2, CircleDashed } from "lucide-react";
import CodePreview from "~/components/Editor/CodePreview";
import { cmsSectionService } from "~/services/cms-section.service";
import { queryKeys } from "~/queryKeys";
import type { CodeSubmissionData } from "~/types/cms-section-submission";
import type { DocumentReviewValue } from "~/components/tiptap-node/document-review/document-review-extension";

interface Props {
  materialID: string;
  title: string;
  autoScore: number;
  review: DocumentReviewValue;
}

const LATEST_PARAMS = {
  page: 1,
  page_size: 1,
  sort_by: "created_at",
  sort_order: "desc",
} as const;

/**
 * Read-only view of a code embed for the instructor submission review: renders
 * the selected student's latest submitted code for the embedded code material.
 */
export function ReviewCodeEmbed({ materialID, title, autoScore, review }: Props) {
  const { sectionID, labID, studentID } = review;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.section.submissionsOfStudent(
      sectionID,
      labID,
      materialID,
      studentID,
      LATEST_PARAMS,
    ),
    queryFn: () =>
      cmsSectionService.getStudentSubmissions<CodeSubmissionData>(
        sectionID,
        labID,
        materialID,
        studentID,
        LATEST_PARAMS,
      ),
    enabled: !!sectionID && !!labID && !!materialID && !!studentID,
  });

  const submission = data?.data?.[0];
  const files = submission?.payload?.files ?? [];

  const renderStatus = () => {
    if (isLoading) {
      return (
        <Loader2 size="0.875rem" className="animate-spin text-(--gray-10)" />
      );
    }
    if (!submission) {
      return <span className="text-xs text-(--gray-10)">Not submitted</span>;
    }
    if (submission.status === "passed") {
      return <CheckCircle2 size="0.875rem" className="text-(--grass-11)" />;
    }
    if (submission.status === "failed" || submission.status === "partial") {
      return <XCircle size="0.875rem" className="text-(--tomato-11)" />;
    }
    return <CircleDashed size="0.875rem" className="text-(--gray-10)" />;
  };

  return (
    <div className="border rounded-lg my-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-(--gray-2) border-b">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 size="1rem" className="text-(--gray-10) shrink-0" />
          <span className="text-sm font-medium text-(--gray-12) truncate">
            {title || "Code Problem"}
          </span>
          {renderStatus()}
        </div>
        <span className="text-sm font-medium text-(--gray-11) shrink-0">
          {submission ? submission.auto_score : "—"} / {autoScore} pts
        </span>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-(--gray-10)">
          <Loader2 size="1.25rem" className="animate-spin" />
        </div>
      ) : files.length > 0 ? (
        <CodePreview files={files} className="h-100 p-3" />
      ) : (
        <div className="flex items-center justify-center h-40 text-sm text-(--gray-10)">
          No code submitted.
        </div>
      )}
    </div>
  );
}
