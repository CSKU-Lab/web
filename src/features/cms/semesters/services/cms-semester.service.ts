import type { PaginationRequestParams } from "~/types/pagination";
import type { CMSSemester } from "~/types/cms-semester";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { BaseService } from "~/services/base.service";

dayjs.extend(utc);

export type GetSemesterPaginationParams = PaginationRequestParams<CMSSemester>;

export type WriteSemesterPayload = Omit<CMSSemester, "id" | "started_date"> & {
  started_date: Date;
};

class SemesterService extends BaseService {
  constructor() {
    super("/cms/semesters");
  }

  async create(payload: WriteSemesterPayload) {
    const startedDate = dayjs(payload.started_date).utc().add(1, "day");
    const res = await this.api.post(this._baseURL, {
      ...payload,
      started_date: startedDate.toISOString(),
    });
    return res.data;
  }

  async getPagination(params: GetSemesterPaginationParams) {
    return this._getPagination<CMSSemester>(params);
  }

  async update(id: string, payload: WriteSemesterPayload) {
    const startedDate = dayjs(payload.started_date).utc().add(1, "day");

    const res = await this.api.patch(`${this._baseURL}/${id}`, {
      ...payload,
      started_date: startedDate.toISOString(),
    });
    return res.data;
  }

  async getAffectedSections(id: string) {
    const res = await this.api.get<
      {
        course_name: string;
        sections: string[];
      }[]
    >(`${this._baseURL}/${id}/affected-sections`);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`${this._baseURL}/${id}`);
  }
}

export const cmsSemesterService = new SemesterService();
