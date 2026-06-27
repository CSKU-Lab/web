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

    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"] ?? "60";
      sessionStorage.setItem("rl_retry_after", retryAfter);
      sessionStorage.setItem("rl_redirect_to", window.location.pathname);
      window.location.href = "/too-many-requests";
      return new Promise(() => {});
    }

    if (error.response?.status === 401) {
      if (originalRequest._retry) {
        window.location.href = "/auth/sign-in";
        return new Promise(() => {});
      }

      originalRequest._retry = true;
      await axios.get(
        `/auth/refresh-token?redirect_to=${window.location.pathname}`,
      );

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);
