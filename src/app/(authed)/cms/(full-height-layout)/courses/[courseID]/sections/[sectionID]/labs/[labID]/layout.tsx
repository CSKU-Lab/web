import type { Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";
import { cmsLabService } from "~/services/cms-lab.service";

export const generateMetadata = async (props: {
  params: Promise<{ labID: string }>;
}): Promise<Metadata> => {
  const { labID } = await props.params;
  const lab = await cmsLabService.getById(labID);
  return { title: `${lab.display_name} | CS Lab` };
};

export default function Layout({ children }: ChildrenProps) {
  return children;
}
