import { BaseService } from "~/services/base.service";
import type { PaginationRequestParams } from "~/types/pagination";
import type { MyCourse } from "~/types/core-course";

export type GetMyCoursesPaginationParams = PaginationRequestParams<MyCourse>;

class MyCoursesService extends BaseService {
  constructor() {
    super("/my-courses");
  }

  async getMyCourses(params: GetMyCoursesPaginationParams) {
    return this._getPagination<MyCourse>(params, `/`);
  }
}

export const myCoursesService = new MyCoursesService();
