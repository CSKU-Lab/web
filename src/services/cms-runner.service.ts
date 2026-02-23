import type { Runner, RunnerListItem, WriteRunner } from "~/types/cms-runner";
import { BaseService } from "./base.service";
import type { PaginationRequestParams } from "~/types/pagination";

export type GetRunnerPaginationParams = PaginationRequestParams<RunnerListItem>;

class CMSRunnerService extends BaseService {
  constructor() {
    super("/cms/configs/runners");
  }

  async create(data: WriteRunner): Promise<Runner> {
    const res = await this.api.post(this._baseURL, data);
    return res.data;
  }

  async getById(runnerId: string): Promise<Runner> {
    const res = await this.api.get<Runner>(`${this._baseURL}/${runnerId}`);
    return {
      ...res.data,
      initial_files: [],
    };
  }

  async updateById(
    runnerId: string,
    data: Partial<WriteRunner>,
  ): Promise<Runner> {
    const res = await this.api.patch<Runner>(
      `${this._baseURL}/${runnerId}`,
      data,
    );
    return res.data;
  }

  async deleteById(runnerId: string): Promise<void> {
    return this.api.delete(`${this._baseURL}/${runnerId}`);
  }

  async getPagination(params: GetRunnerPaginationParams) {
    return this._getPagination<RunnerListItem>(params);
  }

  async testRunner(
    runnerId: string,
    payload: {
      files: { name: string; content: string }[];
      input: string;
      build_script: string;
      run_script: string;
    },
  ) {
    const res = await this.api.post(
      `${this._baseURL}/${runnerId}/test`,
      payload,
    );
    return res.data;
  }
}

export const cmsRunnerService = new CMSRunnerService();
