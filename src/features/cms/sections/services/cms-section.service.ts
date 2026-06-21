import type { Section, Student } from "~/types/cms-section";
import { BaseService } from "~/services/base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import type { CMSSectionLog } from "~/types/cms-section-logs";
import type {
  CMSSectionLab,
  CMSSectionLabDetail,
} from "~/types/cms-section-lab";
import { CMSGradebook } from "~/types/cms-section-gradebook";
import type { LabStatus } from "~/types/cms-section-lab";
import { CMSSectionStudentLatestSubmission } from "~/types/cms-section-submission";
import { CMSLabStatus } from "~/types/cms-lab-status";

export type CreateSectionPayload = {
  name: string;
  instructors: string[];
  semester_id: string;
  banner: File | null;
  students: string[] | null;
  course_id: string;
};

export type UpdateSectionPayload = {
  name?: string;
  instructors?: string[];
  banner?: File | null;
  semester_id?: string;
};

export type GetSectionLogPaginationParams =
  PaginationRequestParams<CMSSectionLog>;

export type GetSectionLabPaginationParams =
  PaginationRequestParams<CMSSectionLab>;

export type GetStudentSubmissionsPaginationParams<T> = PaginationRequestParams<
  CMSSectionStudentLatestSubmission<T>
>;

export type UpdateSectionLabPayload = {
  status: LabStatus;
  opened_at: string | null;
  readonly_at: string | null;
};

class SectionService extends BaseService {
  constructor() {
    super("/cms/sections");
  }

  async create(payload: CreateSectionPayload) {
    const res = await this.api.postForm<{ id: string }>(this._baseURL, payload);
    return res.data.id;
  }

  async getByID(id: string): Promise<Section> {
    const res = await this.api.get<Section>(`${this._baseURL}/${id}`);
    return res.data;
  }

  async addStudents(sectionID: string, studentUsernames: string[]) {
    return this.api.post(`${this._baseURL}/${sectionID}/students`, {
      student_usernames: studentUsernames,
    });
  }

  async removeStudents(sectionID: string, studentIDs: string[]) {
    return this.api.post(`${this._baseURL}/${sectionID}/students/remove`, {
      student_ids: studentIDs,
    });
  }

  async getStudents(id: string) {
    const res = await this.api.get<{ data: Student[] }>(
      `${this._baseURL}/${id}/students`,
    );
    return res.data.data;
  }

  async update(id: string, payload: UpdateSectionPayload) {
    return this.api.patchForm(`${this._baseURL}/${id}`, payload);
  }

  async deleteByID(id: string) {
    return this.api.delete(`${this._baseURL}/${id}`);
  }

  async getLogsPagination(
    sectionID: string,
    params: GetSectionLogPaginationParams,
  ) {
    return this._getPagination<CMSSectionLog>(params, `/${sectionID}/logs`);
  }

  async getLabsPagination(
    sectionID: string,
    params: GetSectionLabPaginationParams,
  ) {
    return this._getPagination<CMSSectionLab>(params, `/${sectionID}/labs`);
  }

  async getLabDetail(sectionID: string, labID: string) {
    const res = await this.api.get<CMSSectionLabDetail>(
      `${this._baseURL}/${sectionID}/labs/${labID}`,
    );
    return res.data;
  }

  async addLabs(sectionID: string, labIDs: string[]) {
    return this.api.post(`${this._baseURL}/${sectionID}/labs`, {
      lab_ids: labIDs,
    });
  }
  async removeLabs(sectionID: string, labIDs: string[]) {
    return this.api.post(`${this._baseURL}/${sectionID}/labs/delete`, {
      lab_ids: labIDs,
    });
  }

  async updateSectionLabPosition(
    sectionID: string,
    labID: string,
    position: number,
  ) {
    return this.api.patch(`${this._baseURL}/${sectionID}/labs`, {
      lab_id: labID,
      position,
    });
  }

  async updateSectionLab(
    sectionID: string,
    labID: string,
    payload: UpdateSectionLabPayload,
  ) {
    return this.api.patch(
      `${this._baseURL}/${sectionID}/labs/${labID}`,
      payload,
    );
  }

  async getGradebook(sectionID: string): Promise<CMSGradebook> {
    const res = await this.api.get<CMSGradebook>(
      `${this._baseURL}/${sectionID}/gradebook`,
    );
    return res.data;
  }

  async getStudentSubmissions<T>(
    sectionID: string,
    labID: string,
    materialID: string,
    studentID: string,
    params: GetStudentSubmissionsPaginationParams<T>,
  ) {
    return await this._getPagination<CMSSectionStudentLatestSubmission<T>>(
      params,
      `/${sectionID}/labs/${labID}/materials/${materialID}/submissions?student_id=${studentID}`,
    );
  }

  async getAllStudentsLatestSubmission<T>(
    sectionID: string,
    labID: string,
    materialID: string,
  ): Promise<CMSSectionStudentLatestSubmission<T>[]> {
    const res = await this.api.get(
      `${this._baseURL}/${sectionID}/labs/${labID}/materials/${materialID}/submissions`,
    );
    return res.data.data;
  }

  async getStudentLabStatus(
    sectionID: string,
    labID: string,
  ): Promise<CMSLabStatus> {
    const res = await this.api.get<CMSLabStatus>(
      `${this._baseURL}/${sectionID}/labs/${labID}/student-status`,
    );
    return res.data;
  }

  async exportGradebook(
    sectionID: string,
    format: "csv" | "xlsx",
  ): Promise<Blob> {
    const res = await this.api.get(
      `${this._baseURL}/${sectionID}/gradebook/export?format=${format}`,
      {
        responseType: "blob",
      },
    );
    return res.data;
  }

  async exportTypingSubmissions(sectionID: string): Promise<Blob> {
    const res = await this.api.get(
      `${this._baseURL}/${sectionID}/typing-submissions/export`,
      { responseType: "blob" },
    );
    return res.data;
  }
}

export const cmsSectionService = new SectionService();
