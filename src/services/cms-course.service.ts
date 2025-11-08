import { api } from "~/lib/api.client";
import type { Course, CreateCourse } from "~/types/cms-course";
import type { VisibilityKey } from "~/types/visibilities";
import { PaginationMixin } from "./pagination.mixin";
import { BaseService } from "./base.service";

class CMSCourseService extends BaseService {
  constructor() {
    super("/admin/courses");
  }

  async create({ name, creators, type }: CreateCourse): Promise<Course> {
    const creatorIds = creators.map((creator) => creator.id);
    const res = await api.post(this._baseURL, {
      name,
      creators: creatorIds,
      type,
    });
    return res.data;
  }

  async getById(courseId: string): Promise<Course> {
    const res = await api.get<Course>(`${this._baseURL}/${courseId}`);
    return res.data;
  }

  async updateByID(
    courseId: string,
    { name, creators }: CreateCourse,
  ): Promise<void> {
    const creatorIds = creators.map((creator) => creator.id);
    return api.patch(`${this._baseURL}/${courseId}`, {
      name,
      creators: creatorIds,
    });
  }
}

export const cmsCourseService = new (PaginationMixin<
  Course,
  typeof CMSCourseService
>(CMSCourseService, { show: "all" }))();

export type GetCoursePaginationParams = Parameters<
  typeof cmsCourseService.getPagination
>[0] & { show?: VisibilityKey };
