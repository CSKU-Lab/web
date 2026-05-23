import type { Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";
import { cmsSectionService } from "~/services/cms-section.service";

export const generateMetadata = async (props: {
  params: Promise<{ sectionID: string }>;
}): Promise<Metadata> => {
  const { sectionID } = await props.params;
  const section = await cmsSectionService.getByID(sectionID);
  return { title: `${section.name} | CS Lab` };
};

export default function Layout({ children }: ChildrenProps) {
  return children;
}
