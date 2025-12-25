import type { CMSMaterial } from "~/types/cms-material";
import { BaseService } from "./base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import { VisibilityKey } from "~/types/visibilities";

export type CreateMaterialPayload = {
  name: string;
  type: "document" | "code" | "type";
  tags: string[];
  visibility: "public" | "private";
};

export type UpdateMaterialPayload = Partial<CreateMaterialPayload> & {
  payload: any;
};

export type GetMaterialPaginationParams = PaginationRequestParams<CMSMaterial>;

class CMSMaterialService extends BaseService {
  constructor() {
    super("/cms/materials");
  }

  async create(payload: CreateMaterialPayload) {
    const res = await this.api.post<{ id: string }>(this._baseURL, payload);
    return res.data.id;
  }

  async getById(id: string): Promise<CMSMaterial> {
    const res = await this.api.get<CMSMaterial>(`${this._baseURL}/${id}`);
    return res.data;
  }

  async update(id: string, payload: UpdateMaterialPayload) {
    return this.api.patch(`${this._baseURL}/${id}`, payload);
  }

  async delete(id: string) {
    return this.api.delete(`${this._baseURL}/${id}`);
  }

  async getPagination(params: GetMaterialPaginationParams) {
    return this._getPagination<CMSMaterial>(params);
  }
}

export const cmsMaterialService = new CMSMaterialService();
