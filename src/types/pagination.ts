export interface PaginationResponse<T> {
  pagination: {
    page: number;
    total_rows: number;
    total_page: number;
  };
  data: T[];
}

export interface PaginationRequestParams<T extends Record<string, any>> {
  page: number;
  page_size: number;
  search: string;
  sort_by: keyof T | "";
  sort_order: string;
  filter?: string;
}
