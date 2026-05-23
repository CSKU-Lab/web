import type { Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";
import { coreCourseService } from "~/services/core-course.service";

export const generateMetadata = async (props: {
  params: Promise<{ courseID: string }>;
}): Promise<Metadata> => {
  const { courseID } = await props.params;
  const { course } = await coreCourseService.getCourseById(courseID);
  return { title: `${course.name} | CS Lab` };
};

export default function Layout({ children }: ChildrenProps) {
  return children;
}
