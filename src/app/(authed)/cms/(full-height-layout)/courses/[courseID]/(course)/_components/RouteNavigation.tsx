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
        className="grid-cols-3"
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
            name: "Settings",
            href: "/cms/courses/:courseID/settings",
          },
        ]}
      />
    </>
  );
}

export default RouteNavigation;
