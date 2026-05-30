"use client";

import type { FuseResultMatch } from "fuse.js";
import { MaterialType } from "~/types/cms-material";
import type {
  CMSSectionStudentLatestSubmission,
  CodeSubmissionData,
} from "~/types/cms-section-submission";
import { CodeContent } from "~/features/cms/submissions/components/fuzzy-search/renderers/CodeContent";
import { DocumentContent } from "~/features/cms/submissions/components/fuzzy-search/renderers/DocumentContent";
import { TypeContent } from "~/features/cms/submissions/components/fuzzy-search/renderers/TypeContent";

interface ContentBlockProps {
  submission: CMSSectionStudentLatestSubmission;
  materialType: MaterialType;
  matches: readonly FuseResultMatch[];
}

const isCodePayload = (payload: unknown): payload is CodeSubmissionData =>
  typeof payload === "object" &&
  payload !== null &&
  "files" in payload &&
  "test_case_groups" in payload;

export function ContentBlock({
  submission,
  materialType,
  matches,
}: ContentBlockProps) {
  if (!submission.payload) {
    return <p className="text-xs text-(--gray-10) italic">No submission yet</p>;
  }

  if (materialType === MaterialType.CODE && isCodePayload(submission.payload)) {
    return <CodeContent payload={submission.payload} matches={matches} />;
  }

  if (materialType === MaterialType.DOCUMENT) {
    return <DocumentContent />;
  }

  if (materialType === MaterialType.TYPE) {
    return <TypeContent />;
  }

  return (
    <p className="text-xs text-(--gray-10) italic">Unknown submission type</p>
  );
}
