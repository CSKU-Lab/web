import { BaseService } from "~/services/base.service";
import type { AnalyticsOverview } from "../types";

/**
 * Reads the same platform-wide analytics overview as the admin dashboard, but
 * via the instructor-accessible /cms/analytics endpoint so the CMS home page
 * can show daily stats without requiring an admin role.
 */
class CMSAnalyticsService extends BaseService {
  constructor() {
    super("/cms/analytics");
  }

  async getOverview(days: number): Promise<AnalyticsOverview> {
    const res = await this.api.get<AnalyticsOverview>(
      `${this._baseURL}/overview?days=${days}`,
    );
    return res.data;
  }
}

export const cmsAnalyticsService = new CMSAnalyticsService();
