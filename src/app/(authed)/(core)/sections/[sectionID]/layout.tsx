import { type Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";
import { coreSectionService } from "~/services/core-section.service";

export const generateMetadata = async (props: {
  params: Promise<{ sectionID: string }>;
}): Promise<Metadata> => {
  const { sectionID } = await props.params;
  const { course } = await coreSectionService.getCourseSectionById(sectionID);
  return {
    title: `${course.name} | CS Lab`,
  };
};

function Layout({ children }: ChildrenProps) {
  return children;
}

export default Layout;