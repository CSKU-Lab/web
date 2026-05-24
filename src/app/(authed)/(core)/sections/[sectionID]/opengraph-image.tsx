import { ogImages } from "~/lib/og";

export const dynamic = "force-dynamic";
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ sectionID: string }>;
}) {
  const { sectionID } = await params;

  try {
    const res = await fetch(ogImages.section(sectionID), {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("not found");
    return new Response(res.body, { headers: { "Content-Type": "image/png" } });
  } catch {
    try {
      const def = await fetch(ogImages.default(), {
        signal: AbortSignal.timeout(5000),
      });
      if (def.ok) {
        return new Response(def.body, { headers: { "Content-Type": "image/png" } });
      }
    } catch {}
    return new Response(null, { status: 404 });
  }
}
