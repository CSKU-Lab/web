"use server";
import axios from "axios";
import { env } from "./env";
import { cookies } from "next/headers";

export const serverApi = axios.create({
  baseURL: env("API_URL"),
  withCredentials: true,
});

serverApi.interceptors.request.use(async function onRequest(config) {
  const cookieJar = await cookies();
  const accessToken = cookieJar.get("access_token")?.value;
  const refreshToken = cookieJar.get("refresh_token")?.value;

  let cookieValue = "";

  if (accessToken) {
    cookieValue += `access_token=${accessToken}; `;
  }

  if (refreshToken) {
    cookieValue += `refresh_token=${refreshToken}; `;
  }

  config.headers.set("Cookie", cookieValue);

  return config;
});
