import type { RunnerConfig } from "~/types/config";
import { BaseService } from "./base.service";

export class ConfigService extends BaseService {
  constructor() {
    super("/config");
  }

  async getRunners(): Promise<RunnerConfig[]> {
    const res = await this.api.get<RunnerConfig[]>(`${this._baseURL}/runners`);
    return res.data;
  }
}

export const configService = new ConfigService();
