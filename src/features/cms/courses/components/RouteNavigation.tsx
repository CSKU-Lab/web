"use client";

import { useParams, usePathname } from "next/navigation";
import NavigationMenus from "~/features/cms/layout/components/nav/NavigationMenus";
import PageTitle from "~/components/commons/PageTitle";
import useResolvePath from "~/hooks/useResolvePath";
import { useSession } from "~/providers/SessionProvider";
import useGetCourse from "~/features/cms/courses/hooks/useGetCourse";

const allMenus = [
  { name: "Sections", href: "/cms/courses/:courseID" },
  { name: "Labs", href: "/cms/courses/:courseID/labs" },
  { name: "Materials", href: "/cms/courses/:courseID/materials" },
  { name: "Settings", href: "/cms/courses/:courseID/settings" },
];

function RouteNavigation() {
  const resolve = useResolvePath();
  const currentPath = usePathname();
  const { courseID } = useParams<{ courseID: string }>();
  const { user } = useSession();
  const { data: course } = useGetCourse({ courseID });
  const isInstructor = user.roles.includes("instructor") && !user.roles.includes("admin");
  const isCourseCreator = course?.creators?.some((c) => c.id === user.sub);
  const isRestrictedInstructor = isInstructor && !isCourseCreator;

  const menus = isRestrictedInstructor
    ? allMenus.filter((m) => m.name !== "Settings")
    : allMenus;

  const activeMenu = menus.find((menu) => {
    const pathEnd = resolve(menu.href).split("/").pop() || "";
    const currentEnd = currentPath.split("/").pop() || "";
    return pathEnd === currentEnd;
  });

  return (
    <>
      <PageTitle>{activeMenu?.name ?? ""}</PageTitle>
      <NavigationMenus menus={menus} />
    </>
  );
}

export default RouteNavigation;
