import type { AxiosInstance } from "axios";
import type {
  PaginationRequestParams,
  PaginationResponse,
} from "~/types/pagination";

type Constructor<
  T = {
    _baseURL: string;
    api: AxiosInstance;
  },
> = new (...args: any[]) => T;

export const PaginationMixin = <
  Item extends Record<string, any>,
  T extends Constructor,
  CustomSortByKeys = never,
>(
  Base: T,
  extraParams?: Record<string, string | number>,
) => {
  let params = {
    page: 1,
    page_size: 10,
    search: "",
    ...extraParams,
  };

  return class Pagination extends Base {
    constructor(...args: any) {
      super(args);
    }

    async getPagination({
      filters,
      ...paramsRequest
    }: Partial<PaginationRequestParams<Item, CustomSortByKeys>>): Promise<
      PaginationResponse<Item>
    > {
      const searchParams = new URLSearchParams();

      params = {
        ...params,
        ...paramsRequest,
      };

      if (filters) {
        filters.forEach((filter) => {
          const field = `${filter.field.value}__${filter.operator}`;
          const value = filter.value;
          searchParams.append(field, value);
        });
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) return;
        searchParams.append(key, value.toString());
      });

      const res = await this.api.get<PaginationResponse<Item>>(
        this._baseURL + "?" + searchParams.toString(),
      );

      return res.data;
    }
  };
};
