import { ogImagesFetch } from "~/lib/og";

export const dynamic = "force-dynamic";
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ sectionID: string; slug: string; materialID: string }>;
}) {
  const { materialID } = await params;

  try {
    const res = await fetch(ogImagesFetch.material(materialID), {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("not found");
    return new Response(res.body, { headers: { "Content-Type": "image/png" } });
  } catch {
    try {
      const def = await fetch(ogImagesFetch.default(), {
        signal: AbortSignal.timeout(5000),
      });
      if (def.ok) {
        return new Response(def.body, { headers: { "Content-Type": "image/png" } });
      }
    } catch {}
    return new Response(null, { status: 404 });
  }
}
