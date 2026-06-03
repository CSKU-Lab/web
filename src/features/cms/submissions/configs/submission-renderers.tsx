import type { ComponentType } from "react";
import { CMSMaterial, MaterialType } from "~/types/cms-material";
import CodeSubmissionDetail from "~/features/cms/submissions/components/renderers/CodeSubmissionDetail";
import TypingSubmissionDetail from "~/features/cms/submissions/components/renderers/TypingSubmissionDetail";
import ComingSoon from "~/features/cms/submissions/components/renderers/ComingSoon";
import type {
  CodeSubmissionData,
  TypingSubmissionData,
} from "~/types/cms-section-submission";

export interface SubmissionRendererProps<T = unknown> {
  id: string;
  material: CMSMaterial;
  created_at: string;
  payload: T;
  auto_score: number;
  manual_score: number;
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
  [MaterialType.DOCUMENT]: ({ payload }: SubmissionRendererProps) => (
    <ComingSoon type="document" />
  ),
  [MaterialType.TYPE]: TypingSubmissionDetail as ComponentType<
    SubmissionRendererProps<TypingSubmissionData>
  >,
};

export function getSubmissionRenderer(
  materialType: MaterialType,
): ComponentType<SubmissionRendererProps<any>> {
  return (
    submissionRenderers[materialType] ??
    (({ payload }: SubmissionRendererProps) => (
      <ComingSoon type={materialType} />
    ))
  );
}
