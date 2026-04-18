import { type Metadata } from "next";
import { timeout } from "~/lib/timeout";
import type { ChildrenProps } from "~/types/children-props";

export const generateMetadata = async (props: {
  params: Promise<{ sectionID: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const courses = [
    { name: "Fundamental Computing Concepts", id: "0" },
    { name: "Fundamental Programming", id: "1" },
  ];

  const course = courses.find((course) => course.id === params.sectionID);
  await timeout(1000);

  return {
    title: `${course?.name} | CS Lab`,
  };
};

function Layout({ children }: ChildrenProps) {
  return children;
}

export default Layout;