import { PaginationMixin } from "./pagination.mixin";
import type { PaginationRequestParams } from "~/types/pagination";
import type { CMSSemester } from "~/types/cms-semester";

export type GetSemesterPaginationParams = Partial<
  PaginationRequestParams<CMSSemester>
>;

class SemesterService {
  _baseURL: string = "/cms/semesters";
}

export const cmsSemesterService = new (PaginationMixin<
  CMSSemester,
  typeof SemesterService
>(SemesterService))();
