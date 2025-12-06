import { api } from "~/lib/api.client";
import { PaginationMixin } from "./pagination.mixin";
import type { CMSSection, Section } from "~/types/cms-section";
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
