import { type Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";
import { coreSectionService } from "~/services/core-section.service";
import { ogImages } from "~/lib/og";

export const generateMetadata = async (props: {
  params: Promise<{ sectionID: string }>;
}): Promise<Metadata> => {
  const { sectionID } = await props.params;
  const ogUrl = ogImages.section(sectionID);

  try {
    const { course } = await coreSectionService.getCourseSectionById(sectionID);
    return {
      title: `${course.name} | CS Lab`,
      openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogUrl] },
    };
  } catch {
    return {
      openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogUrl] },
    };
  }
};

function Layout({ children }: ChildrenProps) {
  return children;
}

export default Layout;