"use client";
import { useParams } from "next/navigation";
import NavigationMenus from "~/app/(authed)/cms/_components/NavigationMenus";
import PageTitle from "~/components/commons/PageTitle";

interface Props {
  title: string;
}

function RouteNavigation({ title }: Props) {
  const { courseID, sectionID } = useParams<{
    courseID: string;
    sectionID: string;
  }>();

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <NavigationMenus
        className="grid-cols-5 w-3/5"
        menus={[
          {
            name: "Students",
            href: `/cms/courses/${courseID}/sections/${sectionID}`,
          },
          {
            name: "Labs",
            href: `/cms/courses/${courseID}/sections/${sectionID}/labs`,
          },
          {
            name: "Gradebook",
            href: `/cms/courses/${courseID}/sections/${sectionID}/gradebook`,
          },
          {
            name: "Logs",
            href: `/cms/courses/${courseID}/sections/${sectionID}/logs`,
          },
          {
            name: "Settings",
            href: `/cms/courses/${courseID}/sections/${sectionID}/settings`,
          },
        ]}
      />
    </>
  );
}

export default RouteNavigation;
