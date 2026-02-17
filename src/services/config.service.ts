import type {
  CompareScriptConfig,
  CompareScriptDetail,
  RunnerConfig,
  RunnerConfigDetail,
} from "~/types/config";
import { BaseService } from "./base.service";
import { PaginationRequestParams } from "~/types/pagination";

export type GetRunnerPaginationParams = PaginationRequestParams<RunnerConfig>;
export type GetCompareScriptPaginationParams =
  PaginationRequestParams<CompareScriptConfig>;

export class ConfigService extends BaseService {
  constructor() {
    super("/cms/configs");
  }

  async getRunners(params: GetRunnerPaginationParams) {
    return this._getPagination<RunnerConfig>(params, `/runners`);
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

export const configService = new ConfigService();
