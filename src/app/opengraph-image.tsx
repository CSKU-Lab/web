import { ImageResponse } from "next/og";
import { OGCard } from "~/components/og/OGCard";
import { loadOGFonts } from "~/lib/og-fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CS Lab — Programming Lab @Computer Science Kasetsart University";

export default async function Image() {
  const fonts = await loadOGFonts();

  return new ImageResponse(
    <OGCard
      title="CS Lab"
      subtitle="Programming Lab @Computer Science Kasetsart University"
    />,
    { ...size, fonts },
  );
}
