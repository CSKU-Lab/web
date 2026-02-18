import { cookies } from "next/headers";

export const POST = async () => {
  const cookieJar = await cookies();
  cookieJar.delete("access_token");
  cookieJar.delete("refresh_token");

  return Response.json({ success: true }, { status: 200 });
};
