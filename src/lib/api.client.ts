import axios from "axios";
import { env } from "./env";

export const api = axios.create({
  baseURL: env("API_URL"),
  withCredentials: true,
});

// Single-flight refresh: when several requests 401 at once (e.g. polling hooks
// after the access token expires), they must share ONE refresh call. Firing a
// refresh per request races the backend token rotation — only the first wins,
// the rest fail the replay check and get bounced to sign-in mid-session.
let refreshPromise: Promise<unknown> | null = null;

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = axios
      .get(`/auth/refresh-token?redirect_to=${window.location.pathname}`)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

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
      try {
        await refreshSession();
      } catch {
        window.location.href = "/auth/sign-in";
        return new Promise(() => {});
      }

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);
