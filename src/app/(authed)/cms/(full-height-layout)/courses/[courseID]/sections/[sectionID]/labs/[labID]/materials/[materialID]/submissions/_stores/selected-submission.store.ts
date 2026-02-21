import { atom } from "jotai";
import type { CMSSectionSubmission } from "~/types/cms-section-submission";

export const selectedSubmissionAtom = atom<CMSSectionSubmission<any> | null>(
  null,
);
