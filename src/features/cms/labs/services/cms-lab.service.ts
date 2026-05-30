import { BaseService } from "~/services/base.service";
import type { CMSLab } from "~/types/cms-lab";
import { PaginationRequestParams } from "~/types/pagination";

class CMSLabService extends BaseService {
  constructor() {
    super("/cms/labs");
  }

  async create(payload: CreateLabPayload) {
    const res = await this.api.post<{ id: string }>(`${this._baseURL}`, {
      course_id: payload.courseID,
      display_name: payload.displayName,
    });
    return res.data.id;
  }

  async getById(labID: string): Promise<CMSLab> {
    const res = await this.api.get<CMSLab>(`${this._baseURL}/${labID}`);
    return res.data;
  }

  async updateById(labID: string, payload: UpdateLabPayload) {
    return this.api.patch(`${this._baseURL}/${labID}`, {
      display_name: payload.displayName,
    });
  }

  async deleteById(labID: string) {
    return this.api.delete(`${this._baseURL}/${labID}`);
  }
}

export const cmsLabService = new CMSLabService();

export type GetLabPaginationParams = PaginationRequestParams<CMSLab> & {};

export type CreateLabPayload = {
  courseID: string;
  displayName: string;
};

export type UpdateLabPayload = {
  displayName: string;
};
