import type {
  CompareScriptConfig,
  CompareScriptDetail,
  RunnerConfig,
  RunnerConfigDetail,
} from "~/types/config";
import { BaseService } from "./base.service";

export class ConfigService extends BaseService {
  constructor() {
    super("/cms/config");
  }

  async getRunners<T extends boolean>(opts?: {
    includeScript?: T;
    search?: string;
  }): Promise<T extends true ? RunnerConfigDetail[] : RunnerConfig[]> {
    const searchparams = new URLSearchParams();
    if (opts?.includeScript) {
      searchparams.append("include_script", "true");
    }
    if (opts?.search) {
      searchparams.append("search", opts.search);
    }
    const url = `/runners?${searchparams.toString()}`;

    const res = await this.api.get(this._baseURL + url);
    return res.data;
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
