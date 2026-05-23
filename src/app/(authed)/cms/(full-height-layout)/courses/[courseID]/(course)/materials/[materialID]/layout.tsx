import type { Metadata } from "next";
import { Provider as JotaiProvider } from "jotai";

import type { ChildrenProps } from "~/types/children-props";
import { cmsMaterialService } from "~/services/cms-material.service";

export const generateMetadata = async (props: {
  params: Promise<{ courseID: string; materialID: string }>;
}): Promise<Metadata> => {
  const { courseID, materialID } = await props.params;
  const material = await cmsMaterialService.getById(courseID, materialID);
  return { title: `${material.name} | CS Lab` };
};

function MaterialLayout({ children }: ChildrenProps) {
  return <JotaiProvider>{children}</JotaiProvider>;
}

export default MaterialLayout;
