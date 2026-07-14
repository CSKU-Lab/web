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

  // Re-evaluates auto-mode input embed submissions of a document material
  // against its current node config. Synchronous — returns per-material counts.
  async regradeInputs(courseID: string, materialID: string) {
    const res = await this.api.post<{ regraded: number; skipped: number }>(
      `/cms/courses/${courseID}/materials/${materialID}/input-submissions/regrade`,
    );
    return res.data;
  }

  async deleteSubmission(submissionID: string) {
    return this.api.delete(`/cms/submissions/${submissionID}`);
  }
}

export const cmsSubmissionService = new CMSSubmissionService();
