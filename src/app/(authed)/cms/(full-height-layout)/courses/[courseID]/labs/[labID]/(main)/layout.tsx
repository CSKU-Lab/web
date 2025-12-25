"use client";
import type { ChildrenProps } from "~/types/children-props";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import { useParams } from "next/navigation";
import PageTitle from "~/components/commons/PageTitle";
import useGetLab from "../_hooks/useGetLab";
import NavigationMenus from "~/app/(authed)/cms/_components/NavigationMenus";

export default function LabLayout({ children }: ChildrenProps) {
  const { labID } = useParams<{ labID: string }>();
  const { data: lab, isFetching } = useGetLab({ labID });
  return (
    <div>
      <PageTitle>
        <Loading
          isLoading={isFetching}
          fallback={<Skeleton className="w-64 h-8" />}
        >
          {lab?.display_name}
        </Loading>
      </PageTitle>

      <NavigationMenus
        menus={[
          {
            name: "Materials",
            href: "/cms/courses/:courseID/labs/:labID",
          },
          {
            name: "Settings",
            href: "/cms/courses/:courseID/labs/:labID/settings",
          },
        ]}
      />
      {children}
    </div>
  );
}
