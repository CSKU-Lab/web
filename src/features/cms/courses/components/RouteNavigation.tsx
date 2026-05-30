"use client";

import { usePathname } from "next/navigation";
import NavigationMenus from "~/app/(authed)/cms/_components/NavigationMenus";
import PageTitle from "~/components/commons/PageTitle";
import useResolvePath from "~/hooks/useResolvePath";

const menus = [
  { name: "Sections", href: "/cms/courses/:courseID" },
  { name: "Labs", href: "/cms/courses/:courseID/labs" },
  { name: "Materials", href: "/cms/courses/:courseID/materials" },
  { name: "Settings", href: "/cms/courses/:courseID/settings" },
];

function RouteNavigation() {
  const resolve = useResolvePath();
  const currentPath = usePathname();

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
