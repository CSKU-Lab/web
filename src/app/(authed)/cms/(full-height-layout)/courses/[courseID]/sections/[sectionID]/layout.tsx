"use client";
import Loading from "~/components/commons/Loading";
import PageTitle from "~/components/commons/PageTitle";
import { Skeleton } from "~/components/ui/skeleton";
import type { ChildrenProps } from "~/types/children-props";
import useGetSection from "./_hooks/useGetSection";
import { useParams } from "next/navigation";
import NavigationMenus from "~/app/(authed)/cms/_components/NavigationMenus";

function Layout({ children }: ChildrenProps) {
  const { sectionID } = useParams<{ sectionID: string }>();
  const { data, isFetching } = useGetSection(sectionID);
  return (
    <>
      <PageTitle>
        <Loading
          isLoading={isFetching}
          fallback={<Skeleton className="w-48 h-8" />}
        >
          {data?.name}
        </Loading>
      </PageTitle>
      <NavigationMenus
        menus={[
          {
            name: "Students",
            href: `/cms/courses/sections/${sectionID}`,
          },
          {
            name: "Labs",
            href: `/cms/courses/sections/${sectionID}/labs`,
          },
          {
            name: "Gradebook",
            href: `/cms/courses/sections/${sectionID}/labs`,
          },
          {
            name: "Logs",
            href: `/cms/courses/sections/${sectionID}/logs`,
          },
          {
            name: "Settings",
            href: `/cms/courses/sections/${sectionID}/settings`,
          },
        ]}
      />
      {children}
    </>
  );
}

export default Layout;
