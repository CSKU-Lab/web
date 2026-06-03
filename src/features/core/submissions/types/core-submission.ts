export type SubmissionStatus = "queued" | "running" | "passed" | "failed";

export interface SubmissionResult<T> {
  id: string;
  status: SubmissionStatus;
  order: number;
  auto_score: number;
  created_at: string;
  payload: T;
}
