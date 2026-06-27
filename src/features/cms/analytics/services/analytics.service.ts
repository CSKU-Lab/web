import { BaseService } from "~/services/base.service";
import type { AnalyticsOverview } from "../types";

class AnalyticsService extends BaseService {
  constructor() {
    super("/admin/analytics");
  }

  async getOverview(days: number): Promise<AnalyticsOverview> {
    const res = await this.api.get<AnalyticsOverview>(
      `${this._baseURL}/overview?days=${days}`,
    );
    return res.data;
  }
}

export const analyticsService = new AnalyticsService();
