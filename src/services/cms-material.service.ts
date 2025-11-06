import { api } from "~/lib/api";
import { PaginationMixin } from "./pagination.mixin";
import type { CMSMaterial } from "~/types/cms-material";

export type CreateMaterialPayload = {
  name: string;
  type: "document" | "code" | "type";
  tags: string[];
  visibility: "public" | "private";
};

class CMSMaterialService {
  _baseURL: string = "/cms/materials";

  async create(payload: CreateMaterialPayload) {
    const res = await api.post<{ id: string }>(this._baseURL, payload);
    return res.data.id;
  }

  async update(id: string, payload: Partial<CreateMaterialPayload>) {
    return api.patch(`${this._baseURL}/${id}`, payload);
  }

  async delete(id: string) {
    return api.delete(`${this._baseURL}/${id}`);
  }
}

export const cmsMaterialService = new (PaginationMixin<
  CMSMaterial,
  typeof CMSMaterialService
>(CMSMaterialService))();

export type GetMaterialPaginationParams = Parameters<
  typeof cmsMaterialService.getPagination
>[0];
