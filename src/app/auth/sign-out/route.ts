import { cookies } from "next/headers";

export const POST = async () => {
  const cookieJar = await cookies();
  const domain = process.env.COOKIE_DOMAIN;
  cookieJar.delete({ name: "access_token", path: "/", domain });
  cookieJar.delete({ name: "refresh_token", path: "/", domain });

  return Response.json({ success: true }, { status: 200 });
};
