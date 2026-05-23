import { BaseService } from "./base.service";
import type { CMSDefaultLab } from "~/types/cms-default-lab";
import { PaginationRequestParams } from "~/types/pagination";

class CMSDefaultLabService extends BaseService {
  constructor() {
    super("/cms/courses");
  }

  async create(params: CreateDefaultLabParams) {
    const { courseID, payload } = params;
    const res = await this.api.post<{ id: string }>(
      `${this._baseURL}/${courseID}/default-labs`,
      payload,
    );
    return res.data.id;
  }

  async update(params: UpdateDefaultLabParams) {
    const { courseID, payload } = params;
    return this.api.patch(`${this._baseURL}/${courseID}/default-labs`, payload);
  }

  async delete(courseID: string, labID: string) {
    const res = await this.api.post(
      `${this._baseURL}/${courseID}/default-labs/delete`,
      {
        lab_id: labID,
      },
    );
    return res.data;
  }
  async getPagination(courseID: string, params: GetDefaultLabPaginationParams) {
    return this._getPagination<CMSDefaultLab>(
      params,
      `/${courseID}/default-labs`,
    );
  }
}

export const cmsDefaultLabService = new CMSDefaultLabService();

export type GetDefaultLabPaginationParams =
  PaginationRequestParams<CMSDefaultLab> & {};

export type DefaultLabPayload = {
  lab_id: string;
  position?: number;
};

export type CreateDefaultLabParams = {
  courseID: string;
  payload: DefaultLabPayload;
};

export type UpdateDefaultLabParams = {
  courseID: string;
  payload: DefaultLabPayload;
};
