import type { IFilter } from "./filter";

export interface PaginationResponse<T> {
  pagination: {
    page: number;
    total_rows: number;
    total_page: number;
  };
  data: T[];
}

interface PaginationRequestPayload<
  T extends Record<string, any>,
  CustomSortByKey = never,
> {
  page: number;
  page_size: number;
  search: string;
  sort_by: [CustomSortByKey] extends [never]
    ? keyof T | ""
    : CustomSortByKey | keyof T;
  sort_order: string;
  filters: IFilter[];
}

export type PaginationRequestParams<
  T extends Record<string, any>,
  CustomSortByKey = never,
> = Partial<PaginationRequestPayload<T, CustomSortByKey>>;
