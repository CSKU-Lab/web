export type SubmissionStatus = "queued" | "running" | "passed" | "failed";

// Status of a material as a whole. Real submission rows only ever carry a
// SubmissionStatus; "partial" is a derived document-level state (some embedded
// code blocks submitted, but not all passing) returned by the material endpoint.
export type MaterialStatus = SubmissionStatus | "partial";

export interface SubmissionResult<T> {
  id: string;
  status: SubmissionStatus;
  order: number;
  auto_score: number;
  created_at: string;
  payload: T;
}
