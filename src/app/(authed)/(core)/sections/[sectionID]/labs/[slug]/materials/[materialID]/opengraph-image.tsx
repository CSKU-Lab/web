import { ogImages } from "~/lib/og";

export const dynamic = "force-dynamic";
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ sectionID: string; slug: string; materialID: string }>;
}) {
  const { materialID } = await params;

  try {
    const res = await fetch(ogImages.material(materialID), {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("not found");
    return new Response(res.body, { headers: { "Content-Type": "image/png" } });
  } catch {
    const def = await fetch(ogImages.default(), {
      signal: AbortSignal.timeout(5000),
    });
    return new Response(def.body, { headers: { "Content-Type": "image/png" } });
  }
}
