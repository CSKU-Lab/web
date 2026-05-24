import { ImageResponse } from "next/og";
import { OGCard } from "~/components/og/OGCard";
import { loadOGFonts } from "~/lib/og-fonts";
import { coreSectionService } from "~/services/core-section.service";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ sectionID: string }>;
}) {
  const { sectionID } = await params;
  const fonts = await loadOGFonts();

  try {
    const { course, section } = await coreSectionService.getCourseSectionById(sectionID);
    return new ImageResponse(
      <OGCard
        title={section.name}
        subtitle={course.name}
        tag={section.semester.name}
      />,
      { ...size, fonts },
    );
  } catch {
    return new ImageResponse(
      <OGCard title="CS Lab" subtitle="Programming Lab @Computer Science Kasetsart University" />,
      { ...size, fonts },
    );
  }
}
