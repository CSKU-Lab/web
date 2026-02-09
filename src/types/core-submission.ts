export type SubmissionStatus = "queued" | "running" | "passed" | "failed";

export interface SubmissionOverviewResult<T> {
  id: string;
  status: SubmissionStatus;
  created_at: string;
  payload: T;
}

export interface SubmissionResult<T> {
  id: string;
  status: SubmissionStatus;
  created_at: string;
  payload: T;
}
