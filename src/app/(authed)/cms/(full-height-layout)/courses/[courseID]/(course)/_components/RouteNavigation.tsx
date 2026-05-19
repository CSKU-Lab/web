import NavigationMenus from "~/app/(authed)/cms/_components/NavigationMenus";
import PageTitle from "~/components/commons/PageTitle";

interface Props {
  title: string;
}

function RouteNavigation({ title }: Props) {
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <NavigationMenus
        className="grid-cols-4"
        menus={[
          {
            name: "Sections",
            href: "/cms/courses/:courseID",
          },
          {
            name: "Labs",
            href: "/cms/courses/:courseID/labs",
          },
          {
            name: "Materials",
            href: "/cms/courses/:courseID/materials",
          },
          {
            name: "Settings",
            href: "/cms/courses/:courseID/settings",
          },
        ]}
      />
    </>
  );
}

export default RouteNavigation;
