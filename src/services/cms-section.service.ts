import { api } from "~/lib/api.client";
import { PaginationMixin } from "./pagination.mixin";
import type { CMSSection, Section, Student } from "~/types/cms-section";
import { BaseService } from "./base.service";

export type CreateSectionPayload = {
  name: string;
  instructors: string[];
  semester_id: string;
  banner: File | null;
  students: string[] | null;
  course_id: string;
};

class SectionService extends BaseService {
  constructor() {
    super("/cms/sections");
  }

  async create(payload: CreateSectionPayload) {
    const res = await api.postForm<{ id: string }>(this._baseURL, payload);
    return res.data.id;
  }

  async getByID(id: string) {
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

  async update(id: string, name: string) {
    return api.patch(`${this._baseURL}/${id}`, { name });
  }

  async delete(id: string) {
    return api.delete(`${this._baseURL}/${id}`);
  }
}

export const cmsSectionService = new (PaginationMixin<
  CMSSection,
  typeof SectionService,
  "started_date"
>(SectionService))();

export type GetSectionPaginationParams = Parameters<
  typeof cmsSectionService.getPagination
>[0];
