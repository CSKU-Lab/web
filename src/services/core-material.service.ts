import { BaseService } from "./base.service";
import type { MaterialDetail } from "~/types/core-material";
import type { SubmissionOverviewResult } from "~/types/core-submission";
import type { PaginationRequestParams } from "~/types/pagination";

export type GetSubmissionPaginationParams<T> = PaginationRequestParams<
  SubmissionOverviewResult<T>
>;

class CoreMaterialService extends BaseService {
  constructor() {
    super("/materials");
  }

  async getPagination<T>(
    materialID: string,
    params: GetSubmissionPaginationParams<T>,
  ) {
    return this._getPagination<SubmissionOverviewResult<T>>(
      params,
      `/${materialID}/submissions`,
    );
  }

  async getById<T>(materialID: string): Promise<MaterialDetail<T>> {
    const res = await this.api.get<MaterialDetail<T>>(
      `/materials/${materialID}`,
    );
    return res.data;
  }
}

export const coreMaterialService = new CoreMaterialService();
