import { BaseService } from "./base.service";
import type { SubmissionResult } from "~/types/core-submission";
import type { PaginationRequestParams } from "~/types/pagination";

export type GetSubmissionPaginationParams<T> = PaginationRequestParams<
  SubmissionResult<T>
>;

class CoreMaterialService extends BaseService {
  constructor() {
    super("/materials");
  }

  async getPagination<T>(
    materialID: string,
    params: GetSubmissionPaginationParams<T>,
  ) {
    return this._getPagination<SubmissionResult<T>>(
      params,
      `/${materialID}/submissions`,
    );
  }
}

export const coreMaterialService = new CoreMaterialService();
