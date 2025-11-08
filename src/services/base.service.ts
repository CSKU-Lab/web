import type { AxiosInstance } from "axios";
import { api } from "~/lib/api.client";
import { serverApi } from "~/lib/api.server";

export class BaseService {
  _baseURL: string;
  api: AxiosInstance;

  constructor(baseURL: string) {
    this._baseURL = baseURL;

    if (typeof window === "undefined") {
      this.api = serverApi;
    } else {
      this.api = api;
    }
  }
}
