"use client";
import { useParams } from "next/navigation";
import NavigationMenus from "~/features/cms/layout/components/nav/NavigationMenus";
import PageTitle from "~/components/commons/PageTitle";

interface Menu {
  name: string;
  href: string;
}

interface Props {
  title?: string;
  headerContent?: React.ReactNode;
  menus?: Menu[];
}

const defaultMenus = (courseID: string, sectionID: string): Menu[] => [
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
];

function RouteNavigation({ title, headerContent, menus }: Props) {
  const { courseID, sectionID } = useParams<{
    courseID: string;
    sectionID: string;
  }>();

  const navigationMenus = menus ?? defaultMenus(courseID, sectionID);

  return (
    <>
      {headerContent ? (
        headerContent
      ) : (
        <PageTitle>{title}</PageTitle>
      )}
      <NavigationMenus
        className="grid-cols-5 w-3/5"
        menus={navigationMenus}
      />
    </>
  );
}

export default RouteNavigation;
