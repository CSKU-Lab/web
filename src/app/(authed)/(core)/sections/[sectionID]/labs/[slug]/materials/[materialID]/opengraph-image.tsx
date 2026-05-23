import { ImageResponse } from "next/og";
import { OGCard } from "~/components/og/OGCard";
import { loadOGFonts } from "~/lib/og-fonts";
import { coreMaterialService } from "~/services/core-material.service";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ sectionID: string; slug: string; materialID: string }>;
}) {
  const { sectionID, slug, materialID } = await params;
  const fonts = await loadOGFonts();

  try {
    const material = await coreMaterialService.getById(materialID, sectionID, slug);
    return new ImageResponse(
      <OGCard title={material.name} tag="Lab Material" />,
      { ...size, fonts },
    );
  } catch {
    return new ImageResponse(
      <OGCard title="CS Lab" subtitle="Programming Lab @Computer Science Kasetsart University" />,
      { ...size, fonts },
    );
  }
}
