import { PaginationMixin } from "./pagination.mixin";
import { BaseService } from "./base.service";
import { type CMSLabMaterial } from "~/types/cms-lab-material";
import { api } from "~/lib/api.client";

class CMSLabMaterialService extends BaseService {
  constructor() {
    super("/cms/labs");
  }

  async create(labID: string, payload: CreateLabMaterialPayload) {
    const res = await api.post<{ id: string }>(
      `${this._baseURL}/${labID}/materials`,
      {
        material_id: payload.materialID,
      },
    );
    return res.data.id;
  }
  async getByLabId(labID: string): Promise<CMSLabMaterial[]> {
    const res = await api.get<CMSLabMaterial[]>(
      `${this._baseURL}/${labID}/materials/all`,
    );
    return res.data;
  }
  async delete(labID: string, payload: DeleteLabMaterialPaylaod) {
    const res = await this.api.post(
      `${this._baseURL}/${labID}/materials/delete`,
      {
        material_id: payload.materialID,
      },
    );
    return res.data;
  }
}

export const cmsLabMaterialService = new (PaginationMixin<
  CMSLabMaterial,
  typeof CMSLabMaterialService
>(CMSLabMaterialService))();

export type GetLabMaterialPaginationParams = Parameters<
  typeof cmsLabMaterialService.getPagination
>[0];

export type GetLabMaterialPaginationRequest = {
  labID: string;
  payload: GetLabMaterialPaginationParams;
};

export type CreateLabMaterialPayload = {
  materialID: string;
};
export type DeleteLabMaterialPaylaod = {
  materialID: string;
};
