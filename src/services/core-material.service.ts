import { BaseService } from "./base.service";
import type { MaterialDetail } from "~/types/core-material";
import type { SubmissionResult } from "~/types/core-submission";
import type { PaginationRequestParams } from "~/types/pagination";

export type GetSubmissionPaginationParams<T> = PaginationRequestParams<
  SubmissionResult<T>
>;

class CoreMaterialService extends BaseService {
  constructor() {
    super("/materials");
  }

  async getSubmissionPagination<T>(
    materialID: string,
    labID: string,
    sectionID: string,
    params: GetSubmissionPaginationParams<T>,
  ) {
    return this._getPagination<SubmissionResult<T>>(
      params,
      `/${materialID}/submissions?lab_id=${labID}&section_id=${sectionID}`,
    );
  }

  async getById<T>(
    materialID: string,
    sectionID: string,
    labID: string,
  ): Promise<MaterialDetail<T>> {
    const res = await this.api.get<MaterialDetail<T>>(
      `/materials/${materialID}?section_id=${sectionID}&lab_id=${labID}`,
    );
    return res.data;
  }
}

export const coreMaterialService = new CoreMaterialService();
