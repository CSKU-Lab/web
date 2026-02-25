import type {
  CreateRunnerConfig,
  RunnerConfig,
  RunnerConfigDetail,
  UpdateRunnerConfig,
} from "~/types/cms-runner";
import { BaseService } from "./base.service";
import type { PaginationRequestParams } from "~/types/pagination";

export type GetRunnerPaginationWithScriptParams =
  PaginationRequestParams<RunnerConfigDetail>;

export type GetRunnerPaginationParams = PaginationRequestParams<RunnerConfig>;

class CMSRunnerService extends BaseService {
  constructor() {
    super("/cms/configs/runners");
  }

  async create(data: CreateRunnerConfig): Promise<{ id: string }> {
    const res = await this.api.post(this._baseURL, data);
    return res.data;
  }

  async getById<T extends boolean>({
    runnerId,
    includeScript,
  }: {
    runnerId: string;
    includeScript: T;
  }): Promise<T extends true ? RunnerConfigDetail : RunnerConfig> {
    const res = await this.api.get(
      `${this._baseURL}/${runnerId}?include_script=${includeScript}`,
    );
    return res.data;
  }

  async updateById(runnerId: string, data: UpdateRunnerConfig): Promise<void> {
    const res = await this.api.patch(`${this._baseURL}/${runnerId}`, data);
    return res.data;
  }

  async deleteById(runnerId: string): Promise<void> {
    return this.api.delete(`${this._baseURL}/${runnerId}`);
  }

  async getPagination<T extends boolean>({
    params,
    includeScripts,
  }: {
    params: T extends true
      ? GetRunnerPaginationWithScriptParams
      : GetRunnerPaginationParams;
    includeScripts?: T;
  }) {
    return this._getPagination(params, `?include_scripts=${includeScripts}`);
  }
}

export const cmsRunnerService = new CMSRunnerService();
