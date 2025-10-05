import { PaginationMixin } from "./pagination.mixin";
import type { PaginationRequestParams } from "~/types/pagination";
import type { CMSSemester } from "~/types/cms-semester";
import { api } from "~/lib/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export type GetSemesterPaginationParams = Partial<
  PaginationRequestParams<CMSSemester>
>;

export type WriteSemesterPayload = Omit<CMSSemester, "id" | "started_date"> & {
  started_date: Date;
};

class SemesterService {
  _baseURL: string = "/cms/semesters";

  async create(payload: WriteSemesterPayload) {
    const startedDate = dayjs(payload.started_date).utc().add(1, "day");
    const res = await api.post(this._baseURL, {
      ...payload,
      started_date: startedDate.toISOString(),
    });
    return res.data;
  }

  async update(id: string, payload: WriteSemesterPayload) {
    const startedDate = dayjs(payload.started_date).utc().add(1, "day");

    const res = await api.patch(`${this._baseURL}/${id}`, {
      ...payload,
      started_date: startedDate.toISOString(),
    });
    return res.data;
  }
}

export const cmsSemesterService = new (PaginationMixin<
  CMSSemester,
  typeof SemesterService
>(SemesterService))();
