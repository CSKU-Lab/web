import type { AxiosInstance } from "axios";
import { api } from "~/lib/api.client";
import { serverApi } from "~/lib/api.server";
import type {
  PaginationRequestParams,
  PaginationResponse,
} from "~/types/pagination";

export class BaseService {
  _baseURL: string;

  get api(): AxiosInstance {
    return typeof window === "undefined" ? serverApi : api;
  }

  constructor(baseURL: string) {
    this._baseURL = baseURL;
  }

  protected async _getPagination<
    Item extends Record<string, any>,
    CustomSortByKeys = never,
  >(
    paramsRequest: Partial<PaginationRequestParams<Item, CustomSortByKeys>>,
    query = "",
  ): Promise<PaginationResponse<Item>> {
    const searchParams = new URLSearchParams();

    const { filters, ...other } = paramsRequest;
    const params = {
      page: 1,
      page_size: 10,
      search: "",
      ...other,
    };

    if (filters) {
      filters.forEach((filter) => {
        const field = `${filter.field.value}__${filter.operator}`;
        const value = filter.value;
        searchParams.append(field, value);
      });
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      searchParams.append(key, value.toString());
    });

    const pathname = query.split("?")[0];
    const hasQueryParams = query.includes("?");
    if (hasQueryParams) {
      const searchParamsFromQuery = new URLSearchParams(query.split("?")[1]);
      searchParamsFromQuery.forEach((value, key) => {
        searchParams.append(key, value);
      });
    }

    const res = await this.api.get<PaginationResponse<Item>>(
      this._baseURL + pathname + "?" + searchParams.toString(),
    );

    return res.data;
  }

  protected async _getPaginationWithBody<
    Item extends Record<string, any>,
    CustomSortByKeys = never,
  >(
    paramsRequest: Partial<PaginationRequestParams<Item, CustomSortByKeys>>,
    query = "",
    requestBody: Record<string, any>,
  ): Promise<PaginationResponse<Item>> {
    const searchParams = new URLSearchParams();

    const { filters, page, page_size, search, ...other } = paramsRequest;

    const params = {
      page: page ?? 1,
      page_size: page_size ?? 10,
      search: search ?? "",
      ...other,
    };

    if (filters?.length) {
      filters.forEach((filter) => {
        const field = `${filter.field.value}__${filter.operator}`;
        searchParams.append(field, String(filter.value));
      });
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const res = await this.api.post<PaginationResponse<Item>>(
      `${this._baseURL}${query}?${searchParams.toString()}`,
      requestBody,
    );

    const data = res.data;

    if (
      !data ||
      !data.pagination ||
      typeof data.pagination.page !== "number" ||
      typeof data.pagination.total_page !== "number"
    ) {
      throw new Error("Invalid pagination response from API");
    }

    return {
      ...data,
      data: data.data ?? [],
    };
  }
}
