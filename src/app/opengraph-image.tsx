import { ogImagesFetch } from "~/lib/og";

export const dynamic = "force-dynamic";
export const contentType = "image/png";

export default async function Image() {
  try {
    const res = await fetch(ogImagesFetch.default(), {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      return new Response(res.body, { headers: { "Content-Type": "image/png" } });
    }
  } catch {}
  return new Response(null, { status: 404 });
}
