import { BaseService } from "~/services/base.service";
import type { PaginationRequestParams } from "~/types/pagination";

export type CMSTag = {
  id: string;
  name: string;
};

export type GetTagPaginationParams = PaginationRequestParams<CMSTag>;

class CMSTagService extends BaseService {
  constructor() {
    super("/cms/tags");
  }

  async getPagination(params: GetTagPaginationParams) {
    return this._getPagination<CMSTag>(params);
  }
}

export const cmsTagService = new CMSTagService();
