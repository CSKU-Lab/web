import type { SubmissionResult } from "~/types/core-submission";
import { BaseService } from "~/services/base.service";
import { PaginationRequestParams } from "~/types/pagination";

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

export type GetSubmissionPaginationParams<T> = PaginationRequestParams<
  SubmissionResult<T>
>;

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
      this._baseURL + `/api/v1/submissions/${submissionID}/listen`,
      {
        withCredentials: true,
      },
    );
    return eventSource;
  }

  async getSubmissionPagination<T>(
    params: GetSubmissionPaginationParams<T>,
    materialID?: string,
    labID?: string,
    sectionID?: string,
  ) {
    return this._getPagination<SubmissionResult<T>>(
      params,
      `submissions/?lab_id=${labID}&section_id=${sectionID}&material_id=${materialID}`,
    );
  }
}

export const coreSubmissionService = new SubmissionService();
