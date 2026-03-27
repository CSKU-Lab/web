import type { CompareScriptConfig, CompareScriptDetail } from "~/types/config";
import { BaseService } from "./base.service";
import type { PaginationRequestParams, PaginationResponse } from "~/types/pagination";

export type GetCompareScriptPaginationParams =
  PaginationRequestParams<CompareScriptDetail>;

export class CompareService extends BaseService {
  constructor() {
    super("/cms/configs");
  }

  async getPagination({
    params,
  }: {
    params: GetCompareScriptPaginationParams;
  }): Promise<PaginationResponse<CompareScriptDetail>> {
    return this._getPagination(params, "/compare-scripts");
  }

  async getCompareScripts<T extends boolean>(opts?: {
    fullDetail?: T;
    search?: string;
  }): Promise<T extends true ? CompareScriptDetail[] : CompareScriptConfig[]> {
    const searchParams = new URLSearchParams();
    if (opts?.search) {
      searchParams.append("search", opts.search);
    }

    if (opts?.fullDetail) {
      searchParams.append("full_detail", "true");
    }

    const url = `/compare-scripts?${searchParams.toString()}`;
    const res = await this.api.get(this._baseURL + url);
    return res.data;
  }

  async getCompareScriptsList(opts?: {
    search?: string;
  }): Promise<CompareScriptConfig[]> {
    const searchParams = new URLSearchParams();
    if (opts?.search) {
      searchParams.append("search", opts.search);
    }

    const url = `/compare-scripts-list?${searchParams.toString()}`;
    const res = await this.api.get(this._baseURL + url);
    return res.data;
  }
}

export const cmsCompareService = new CompareService();
