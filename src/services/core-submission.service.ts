import type { SubmissionResult } from "~/types/core-submission";
import { BaseService } from "./base.service";

interface BaseSubmissionPayload<T> {
  material_id: string;
  lab_id: string;
  payload: T;
}

type SubmissionPayload<T> = BaseSubmissionPayload<T> &
  (
    | {
        section_id: string;
      }
    | {
        course_id: string;
      }
  );

class SubmissionService extends BaseService {
  constructor() {
    super("");
  }

  async create<T>(payload: SubmissionPayload<T>) {
    return this.api.post<{ id: string }>(`/submissions/`, payload);
  }

  async getByID<T>(submissionID: string): Promise<SubmissionResult<T>> {
    const res = await this.api.get<SubmissionResult<T>>(
      `/submissions/${submissionID}/`,
    );
    return res.data;
  }

  async listenByID(submissionID: string): Promise<EventSource> {
    const eventSource = new EventSource(
      this._baseURL + `/submissions/${submissionID}`,
      {
        withCredentials: true,
      },
    );
    return eventSource;
  }
}

export const coreSubmissionService = new SubmissionService();
