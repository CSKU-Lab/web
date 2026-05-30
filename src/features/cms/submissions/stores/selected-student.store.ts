import { atom } from "jotai";
import { CMSSectionSubmissionStudent } from "~/types/cms-section-submission";

export const selectedStudentAtom = atom<CMSSectionSubmissionStudent | null>(
  null,
);
export const viewAllSubmisisonsAtom = atom(false);
