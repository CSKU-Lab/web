import { PaginationMixin } from "./pagination.mixin";
import { BaseService } from "./base.service";
import type { CMSDefaultLab } from "~/types/cms-default-lab";
import { api } from "~/lib/api.client";

class CMSDefaultLabService extends BaseService {
  constructor() {
    super("/cms/courses");
  }

  async create(params: CreateDefaultLabParams) {
    const { courseID, payload } = params;
    const res = await api.post<{ id: string }>(
      `${this._baseURL}/${courseID}/default-labs`,
      payload,
    );
    return res.data.id;
  }

  async update(params: UpdateDefaultLabParams) {
    const { courseID, payload } = params;
    return api.patch(`${this._baseURL}/${courseID}/default-labs`, payload);
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
}

export const cmsDefaultLabService = new (PaginationMixin<
  CMSDefaultLab,
  typeof CMSDefaultLabService
>(CMSDefaultLabService))();

export type GetDefaultLabPaginationParams = Parameters<
  typeof cmsDefaultLabService.getPagination
>[0];

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
