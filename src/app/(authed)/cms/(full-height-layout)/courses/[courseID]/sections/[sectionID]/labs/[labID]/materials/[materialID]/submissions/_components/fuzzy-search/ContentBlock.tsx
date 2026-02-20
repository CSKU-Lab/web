"use client";

import type { FuseResultMatch } from "fuse.js";
import { MaterialType } from "~/types/cms-material";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";
import type { CodeSubmissionData } from "~/types/cms-section-submission";
import { CodeContent } from "./renderers/CodeContent";
import { DocumentContent } from "./renderers/DocumentContent";
import { TypeContent } from "./renderers/TypeContent";

interface ContentBlockProps {
  submission: CMSSectionStudentSubmission;
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
    return (
      <p className="text-xs text-(--gray-10) italic">No submission yet</p>
    );
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

  return <p className="text-xs text-(--gray-10) italic">Unknown submission type</p>;
}
