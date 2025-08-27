import { api } from "~/lib/api";
import type { Course, CreateCourse } from "~/types/cms-course";
import type { PaginationRequestParams } from "~/types/pagination";
import type { VisibilityKey } from "~/types/visibilities";
import { PaginationMixin } from "./pagination.mixin";

export type GetCoursePaginationParams = Partial<
  PaginationRequestParams<Course>
> & { show: VisibilityKey };

class CMSCourseService {
  _baseURL = "/admin/courses";

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
    { name, creators, type }: CreateCourse,
  ): Promise<void> {
    const creatorIds = creators.map((creator) => creator.id);
    return api.patch(`${this._baseURL}/${courseId}`, {
      name,
      creators: creatorIds,
      type,
    });
  }
}

export const cmsCourseService = new (PaginationMixin<
  Course,
  typeof CMSCourseService
>(CMSCourseService, { show: "all" }))();
