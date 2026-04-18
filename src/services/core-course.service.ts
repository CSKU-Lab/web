import { BaseService } from "./base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import type { PublicCourse, CourseDetailResponse } from "~/types/public-course";

export type GetCoursePaginationParams = PaginationRequestParams<PublicCourse>;

class CoreCourseService extends BaseService {
  constructor() {
    super("/courses");
  }

  async getFeatured(limit: number = 4) {
    const res = await this.api.get<{ data: PublicCourse[] }>(
      `${this._baseURL}/featured?limit=${limit}`,
    );
    return res.data.data;
  }

  async getCourses(params: GetCoursePaginationParams) {
    return this._getPagination<PublicCourse>(params, `/`);
  }

  async getCourseById(courseId: string) {
    const res = await this.api.get<CourseDetailResponse>(
      `${this._baseURL}/${courseId}`,
    );
    return res.data;
  }

  async enroll(courseId: string) {
    const res = await this.api.post(`${this._baseURL}/${courseId}/enroll`);
    return res.data;
  }

  async unenroll(courseId: string) {
    const res = await this.api.delete(`${this._baseURL}/${courseId}/enroll`);
    return res.data;
  }
}

export const coreCourseService = new CoreCourseService();

