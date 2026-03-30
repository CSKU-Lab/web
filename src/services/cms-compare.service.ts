import type {
  CompareConfig,
  CompareConfigDetail,
  CreateCompareConfig,
  UpdateCompareConfig,
} from "~/types/cms-compare";
import { BaseService } from "./base.service";
import type { PaginationRequestParams } from "~/types/pagination";

export type GetComparePaginationWithScriptParams =
  PaginationRequestParams<CompareConfigDetail>;

export type GetComparePaginationParams = PaginationRequestParams<CompareConfig>;

class CMSCompareService extends BaseService {
  constructor() {
    super("/cms/configs/compare-scripts");
  }

  async create(data: CreateCompareConfig): Promise<{ id: string }> {
    const res = await this.api.post(this._baseURL, data);
    return res.data;
  }

  async getById<T extends boolean>({
    compareId,
    includeScript,
  }: {
    compareId: string;
    includeScript: T;
  }): Promise<T extends true ? CompareConfigDetail : CompareConfig> {
    const res = await this.api.get(
      `${this._baseURL}/${compareId}?include_script=${includeScript}`,
    );
    return res.data;
  }

  async updateById(
    compareId: string,
    data: UpdateCompareConfig,
  ): Promise<void> {
    const res = await this.api.patch(`${this._baseURL}/${compareId}`, data);
    return res.data;
  }

  async deleteById(compareId: string): Promise<void> {
    return this.api.delete(`${this._baseURL}/${compareId}`);
  }

  async getPagination<T extends boolean>({
    params,
    includeScripts,
  }: {
    params: T extends true
      ? GetComparePaginationWithScriptParams
      : GetComparePaginationParams;
    includeScripts?: T;
  }) {
    return this._getPagination(params, `?include_scripts=${includeScripts}`);
  }
}

export const cmsCompareService = new CMSCompareService();
