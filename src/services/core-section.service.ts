import { BaseService } from "./base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import { Section } from "~/types/core-section";
import { SectionLab } from "~/types/core-section-lab";
import { Course } from "~/types/core-course";

export type GetSectionPaginationParams = PaginationRequestParams<Section>;
export type GetSectionLabPaginationParams = PaginationRequestParams<SectionLab>;
export type GetCourseSectionResponse = {
  course: Course;
  section: Section;
};

class SectionService extends BaseService {
  constructor() {
    super("/sections");
  }

  async getSectionsPagination(params: GetSectionPaginationParams) {
    return this._getPagination<Section>(params, `/`);
  }

  async getLabsInSectionPagination(
    sectionID: string,
    params: GetSectionLabPaginationParams,
  ) {
    return this._getPagination<SectionLab>(params, `/${sectionID}/labs`);
  }

  async getLabInSectionById(sectionID: string, labID: string) {
    const res = await this.api.get<SectionLab>(
      `${this._baseURL}/${sectionID}/labs/${labID}`,
    );
    return res.data;
  }

  async getCourseSectionById(sectionID: string) {
    const res = await this.api.get<GetCourseSectionResponse>(
      `${this._baseURL}/${sectionID}`,
    );
    return res.data;
  }

  async unenrollById(sectionID: string) {
    return this.api.delete(`${this._baseURL}/${sectionID}/unenroll`);
  }
}

export const coreSectionService = new SectionService();
