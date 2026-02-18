import type { ComponentType } from "react";
import { MaterialType } from "~/types/cms-material";
import CodeSubmissionDetail from "../_components/renderers/CodeSubmissionDetail";
import ComingSoon from "../_components/renderers/ComingSoon";
import type { CodeSubmissionData } from "~/types/cms-section-submission";

export interface SubmissionRendererProps<T = unknown> {
  submission: T;
}

// Register renderers for each material type here.
// To add support for a new material type:
// 1. Define the submission data type in cms-section-submission.ts
// 2. Create a renderer component in _components/renderers/
// 3. Add the mapping below
const submissionRenderers: Record<
  MaterialType,
  ComponentType<SubmissionRendererProps<any>>
> = {
  [MaterialType.CODE]: CodeSubmissionDetail as ComponentType<
    SubmissionRendererProps<CodeSubmissionData>
  >,
  [MaterialType.DOCUMENT]: ({ submission }: SubmissionRendererProps) => (
    <ComingSoon type="document" />
  ),
  [MaterialType.TYPE]: ({ submission }: SubmissionRendererProps) => (
    <ComingSoon type="type" />
  ),
};

export function getSubmissionRenderer(
  materialType: MaterialType,
): ComponentType<SubmissionRendererProps<any>> {
  return (
    submissionRenderers[materialType] ??
    (({ submission }: SubmissionRendererProps) => (
      <ComingSoon type={materialType} />
    ))
  );
}
