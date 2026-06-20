import { BaseService } from "~/services/base.service";

class CMSSubmissionService extends BaseService {
  constructor() {
    super("/cms/submissions");
  }

  async updateManualScore(submissionID: string, score: number) {
    return this.api.patch(`${this._baseURL}/${submissionID}/manual-score`, {
      manual_score: score,
    });
  }

  async regradeAll(sectionID: string, labID: string, materialID: string) {
    return this.api.post(
      `/cms/sections/${sectionID}/labs/${labID}/materials/${materialID}/regrade`,
    );
  }
}

export const cmsSubmissionService = new CMSSubmissionService();
