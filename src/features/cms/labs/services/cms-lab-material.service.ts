import { BaseService } from "~/services/base.service";
import { type CMSLabMaterial } from "~/types/cms-lab-material";
import { PaginationRequestParams } from "~/types/pagination";

class CMSLabMaterialService extends BaseService {
  constructor() {
    super("/cms/labs");
  }

  async create(labID: string, payload: CreateLabMaterialPayload) {
    const res = await this.api.post<{ id: string }>(
      `${this._baseURL}/${labID}/materials`,
      {
        material_id: payload.materialID,
      },
    );
    return res.data.id;
  }
  async getByLabId(labID: string): Promise<CMSLabMaterial[]> {
    const res = await this.api.get<CMSLabMaterial[]>(
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
  async getPagination(labID: string, params: GetLabMaterialPaginationParams) {
    return this._getPagination<CMSLabMaterial>(params, `/${labID}/materials`);
  }
  async updatePosition(labID: string, materialID: string, position: number) {
    await this.api.patch(`${this._baseURL}/${labID}/materials/${materialID}/position`, { position });
  }
  async reorder(labID: string, materialIDs: string[]) {
    await this.api.patch(`${this._baseURL}/${labID}/materials/positions`, {
      material_ids: materialIDs,
    });
  }
}

export const cmsLabMaterialService = new CMSLabMaterialService();

export type GetLabMaterialPaginationParams =
  PaginationRequestParams<CMSLabMaterial> & {};

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
