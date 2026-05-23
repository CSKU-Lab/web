import type { Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";
import { cmsCompareService } from "~/services/cms-compare.service";

export const generateMetadata = async (props: {
  params: Promise<{ compareId: string }>;
}): Promise<Metadata> => {
  const { compareId } = await props.params;
  const compare = await cmsCompareService.getById({ compareId, includeScript: false });
  return { title: `${compare.name} | CS Lab` };
};

export default function Layout({ children }: ChildrenProps) {
  return children;
}
