import type { Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";
import { cmsRunnerService } from "~/services/cms-runner.service";

export const generateMetadata = async (props: {
  params: Promise<{ runnerId: string }>;
}): Promise<Metadata> => {
  const { runnerId } = await props.params;
  const runner = await cmsRunnerService.getById({ runnerId, includeScript: false });
  return { title: `${runner.name} | CS Lab` };
};

export default function Layout({ children }: ChildrenProps) {
  return children;
}
