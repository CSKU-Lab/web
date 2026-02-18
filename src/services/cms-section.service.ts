import { api } from "~/lib/api.client";
import type { Section, Student } from "~/types/cms-section";
import { BaseService } from "./base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import type { CMSSectionLog } from "~/types/cms-section-logs";
import type {
  CMSSectionLab,
  CMSSectionLabDetail,
} from "~/types/cms-section-lab";
import { CMSGradebook } from "~/types/cms-section-gradebook";

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

class SectionService extends BaseService {
  constructor() {
    super("/cms/sections");
  }

  async create(payload: CreateSectionPayload) {
    const res = await api.postForm<{ id: string }>(this._baseURL, payload);
    return res.data.id;
  }

  async getByID(id: string): Promise<Section> {
    const res = await api.get<Section>(`${this._baseURL}/${id}`);
    return res.data;
  }

  async addStudents(sectionID: string, studentUsernames: string[]) {
    return api.post(`${this._baseURL}/${sectionID}/students`, {
      student_usernames: studentUsernames,
    });
  }

  async removeStudents(sectionID: string, studentIDs: string[]) {
    return api.post(`${this._baseURL}/${sectionID}/students/remove`, {
      student_ids: studentIDs,
    });
  }

  async getStudents(id: string) {
    const res = await api.get<{ data: Student[] }>(
      `${this._baseURL}/${id}/students`,
    );
    return res.data.data;
  }

  async update(id: string, payload: UpdateSectionPayload) {
    return api.patchForm(`${this._baseURL}/${id}`, payload);
  }

  async deleteByID(id: string) {
    return api.delete(`${this._baseURL}/${id}`);
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
    const res = await api.get<CMSSectionLabDetail>(
      `${this._baseURL}/${sectionID}/labs/${labID}`,
    );
    return res.data;
  }

  async addLabs(sectionID: string, labIDs: string[]) {
    return api.post(`${this._baseURL}/${sectionID}/labs`, {
      lab_ids: labIDs,
    });
  }
  async removeLabs(sectionID: string, labIDs: string[]) {
    return api.post(`${this._baseURL}/${sectionID}/labs/delete`, {
      lab_ids: labIDs,
    });
  }

  async updateSectionLabPosition(
    sectionID: string,
    labID: string,
    position: number,
  ) {
    return api.patch(`${this._baseURL}/${sectionID}/labs`, {
      lab_id: labID,
      position,
    });
  }

  async getGradebook(sectionID: string): Promise<CMSGradebook> {
    const res = await this.api.get<CMSGradebook>(
      `${this._baseURL}/${sectionID}/gradebook`,
    );
    return res.data;
  }
}

export const cmsSectionService = new SectionService();
