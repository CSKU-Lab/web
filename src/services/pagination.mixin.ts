import { api } from "~/lib/api";
import type {
  PaginationRequestParams,
  PaginationResponse,
} from "~/types/pagination";

type Constructor<
  T = {
    _baseURL: string;
  },
> = new (...args: any[]) => T;

export const PaginationMixin = <
  Item extends Record<string, any>,
  T extends Constructor,
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
    async getPagination({
      filter,
      ...paramsRequest
    }: Partial<PaginationRequestParams<Item>>): Promise<
      PaginationResponse<Item>
    > {
      const searchParams = new URLSearchParams();

      params = {
        ...params,
        ...paramsRequest,
      };

      if (filter) {
        filter.forEach((filter) => {
          const field = `${filter.field.value}__${filter.operator}`;
          const value = filter.value;
          searchParams.append(field, value);
        });
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) return;
        searchParams.append(key, value.toString());
      });

      const res = await api.get<PaginationResponse<Item>>(
        this._baseURL + "?" + searchParams.toString(),
      );

      return res.data;
    }
  };
};
