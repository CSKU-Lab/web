import type { AxiosHeaderValue } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { serverApi } from "~/lib/api.server";
import { verifyJWT } from "~/lib/verify-jwt";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const cookieJar = await cookies();

  const searchParams = req.nextUrl.searchParams;

  const refreshToken = cookieJar.get("refresh_token")?.value;

  let isRefreshTokenValid = false;

  try {
    // verify if refresh token is valid throw error if not
    verifyJWT(refreshToken);
    isRefreshTokenValid = true;
  } catch {
    // Invalid or missing refresh token — will redirect to sign-in below
  }

  if (!isRefreshTokenValid) {
    redirect("/auth/sign-in");
  }

  let resCookies: AxiosHeaderValue = [];

  try {
    const res = await serverApi.post("/auth/refresh-token");

    resCookies = res.headers["set-cookie"] || [];
  } catch {
    redirect("/auth/sign-in");
  }

  const redirectTo = searchParams.get("redirect_to") || "/";

  const response = NextResponse.redirect(
    new URL(redirectTo, req.url),
  );

  (resCookies as string[]).forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });

  return response;
};
