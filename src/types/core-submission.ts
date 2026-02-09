export type SubmissionStatus = "queued" | "running" | "passed" | "failed";

export interface SubmissionResult<T> {
  id: string;
  status: SubmissionStatus;
  order: number;
  created_at: string;
  payload: T;
}
