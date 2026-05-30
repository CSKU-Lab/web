import { BaseService } from "~/services/base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import type { Section } from "~/types/core-section";
import type { SectionLab } from "~/types/core-section-lab";
import type { Lab } from "~/types/core-lab";
import { LabMaterial } from "~/types/core-lab-material";

export type GetSectionPaginationParams = PaginationRequestParams<Section>;
export type GetSectionLabPaginationParams = PaginationRequestParams<SectionLab>;
export type GetMaterialPaginationParams = PaginationRequestParams<LabMaterial>;
export type GetLabPayload = {
  section_id: string;
};

class LabService extends BaseService {
  constructor() {
    super("/labs");
  }
  async getLabById(labID: string, payload: GetLabPayload) {
    const res = await this.api.post<Lab>(`${this._baseURL}/${labID}`, {
      section_id: payload.section_id,
    });
    return res.data;
  }

  async getMaterialsInLabPagination(
    labID: string,
    sectionID: string,
    params: GetMaterialPaginationParams,
  ) {
    return this._getPagination<LabMaterial>(
      params,
      `/${labID}/materials?section_id=${sectionID}`,
    );
  }
}

export const coreLabService = new LabService();
