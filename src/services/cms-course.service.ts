import type { Course, WriteCourse } from "~/types/cms-course";
import { BaseService } from "./base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import type { CMSSection } from "~/types/cms-section";
import type { VisibilityKey } from "~/types/visibilities";
import { CMSLab } from "~/types/cms-lab";
import { GetLabPaginationParams } from "./cms-lab.service";

export type GetSectionPaginationParams = PaginationRequestParams<
  CMSSection,
  "started_date"
>;

export type GetCoursePaginationParams = PaginationRequestParams<Course> & {
  show: VisibilityKey;
};

class CMSCourseService extends BaseService {
  constructor() {
    super("/cms/courses");
  }

  async create({ name, creators, visibility }: WriteCourse): Promise<Course> {
    const creatorIds = creators.map((creator) => creator.id);
    const res = await this.api.post(this._baseURL, {
      name,
      creators: creatorIds,
      visibility,
    });
    return res.data;
  }

  async getById(courseId: string): Promise<Course> {
    const res = await this.api.get<Course>(`${this._baseURL}/${courseId}`);
    return res.data;
  }

  async updateByID(
    courseId: string,
    { name, creators, visibility }: WriteCourse,
  ): Promise<void> {
    const creatorIds = creators.map((creator) => creator.id);
    return this.api.patch(`${this._baseURL}/${courseId}`, {
      name,
      visibility,
      creators: creatorIds,
    });
  }

  async deleteByID(courseId: string): Promise<void> {
    return this.api.delete(`${this._baseURL}/${courseId}`);
  }

  async getPagination(params: GetCoursePaginationParams) {
    return this._getPagination<Course>(params);
  }

  async getLabByCoursePagination(
    courseID: string,
    params: GetLabPaginationParams,
  ) {
    return this._getPagination<CMSLab>(params, `/${courseID}/labs`);
  }

  async getSectionsByCourseIDPagination(
    courseID: string,
    params: GetSectionPaginationParams,
  ) {
    return this._getPagination<CMSSection, "started_date">(
      params,
      `/${courseID}/sections`,
    );
  }
}

export const cmsCourseService = new CMSCourseService();
