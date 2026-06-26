import type { CMSMaterial } from "~/types/cms-material";
import { BaseService } from "~/services/base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import type { AxiosProgressEvent } from "axios";

export type CreateMaterialPayload = {
  name: string;
  type: "document" | "code" | "typing";
  tags: string[];
  visibility: "public" | "private";
  manual_score?: number;
};

export type UpdateMaterialPayload = Partial<CreateMaterialPayload> & {
  auto_score?: number;
  payload?: any | null;
};

export type GetMaterialPaginationParams = PaginationRequestParams<CMSMaterial>;

class CMSMaterialService extends BaseService {
  constructor() {
    super("/cms/courses");
  }

  private materialsURL(courseID: string) {
    return `${this._baseURL}/${courseID}/materials`;
  }

  async create(courseID: string, payload: CreateMaterialPayload) {
    const res = await this.api.post<{ id: string }>(
      this.materialsURL(courseID),
      payload,
    );
    return res.data.id;
  }

  async fork(courseID: string, sourceMaterialID: string) {
    const res = await this.api.post<{ id: string }>(
      `${this.materialsURL(courseID)}/fork`,
      {
        source_material_id: sourceMaterialID,
      },
    );
    return res.data.id;
  }

  /**
   * Clone a material within the same course, including all its config
   * (e.g. code config). The clone's name gets a " (Clone)" suffix server-side.
   */
  async clone(courseID: string, sourceMaterialID: string) {
    const res = await this.api.post<{ id: string }>(
      `${this.materialsURL(courseID)}/clone`,
      {
        source_material_id: sourceMaterialID,
      },
    );
    return res.data.id;
  }

  async getById(courseID: string, id: string): Promise<CMSMaterial> {
    const res = await this.api.get<CMSMaterial>(
      `${this.materialsURL(courseID)}/${id}`,
    );
    return res.data;
  }

  async update(courseID: string, id: string, payload: UpdateMaterialPayload) {
    return this.api.patch(`${this.materialsURL(courseID)}/${id}`, payload);
  }

  async delete(courseID: string, id: string) {
    return this.api.delete(`${this.materialsURL(courseID)}/${id}`);
  }

  async getPagination(courseID: string, params: GetMaterialPaginationParams) {
    return this._getPagination<CMSMaterial>(params, `/${courseID}/materials`);
  }

  async uploadAsset(
    courseID: string,
    id: string,
    file: File,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
    signal?: AbortSignal,
  ) {
    return this.api.postForm<{ url: string }>(
      `${this.materialsURL(courseID)}/${id}/assets`,
      {
        file,
      },
      {
        signal,
        onUploadProgress,
      },
    );
  }
}

export const cmsMaterialService = new CMSMaterialService();
