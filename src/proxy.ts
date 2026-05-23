import { NextResponse, type NextRequest } from "next/server";
import { rolesAllowlistMiddleware } from "./middlewares/roles-allowlist";
import { verifyJWT } from "./lib/verify-jwt";

export async function proxy(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/auth/") ||
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.endsWith("/opengraph-image") ||
    req.nextUrl.pathname.endsWith("/twitter-image")
  ) {
    return NextResponse.next();
  }

  const base = process.env.WEB_URL ?? req.nextUrl.origin;

  if (req.nextUrl.pathname.startsWith("/")) {
    try {
      verifyJWT(req.cookies.get("access_token")?.value);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "UNAUTHORIZED") {
          return NextResponse.redirect(new URL("/auth/sign-in", base));
        }

        if (err.message === "NO_TOKEN" || err.message === "TOKEN_EXPIRED") {
          const redirectTo = req.nextUrl.pathname;
          return NextResponse.redirect(
            new URL("/auth/refresh-token?redirect_to=" + redirectTo, base),
          );
        }
      }
      return NextResponse.redirect(new URL("/auth/sign-out", base));
    }
  }

  for (const path of ["/cms/semesters", "/cms/users"]) {
    if (req.nextUrl.pathname.startsWith(path)) {
      return await rolesAllowlistMiddleware(req, ["admin"]);
    }
  }

  if (req.nextUrl.pathname.startsWith("/cms")) {
    return await rolesAllowlistMiddleware(req, ["admin", "instructor"]);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
