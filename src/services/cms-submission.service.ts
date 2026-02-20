import { BaseService } from "./base.service";

class CMSSubmissionService extends BaseService {
  constructor() {
    super("/cms/submissions");
  }

  async updateManualScore(submissionID: string, score: number) {
    return this.api.patch(`${this._baseURL}/${submissionID}/manual-score`, {
      manual_score: score,
    });
  }
}

export const cmsSubmissionService = new CMSSubmissionService();
