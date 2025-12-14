import axios from "axios";
import { env } from "./env";

export const api = axios.create({
  baseURL: env("API_URL"),
  withCredentials: true,
});

api.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  async function onRejected(error) {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      await axios.get(
        `/auth/refresh-token?redirect_to=${window.location.pathname}`,
      );

      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);
