"use client";
import type { ChildrenProps } from "~/types/children-props";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import PageTitle from "~/components/commons/PageTitle";
import NavigationMenus from "~/features/cms/layout/components/nav/NavigationMenus";
import { useBreadcrumbEntity } from "~/features/cms/layout/components/nav/BreadcrumbProvider";
import type { CMSLab } from "~/types/cms-lab";

export default function LabLayout({ children }: ChildrenProps) {
  const { data: lab, isLoading } = useBreadcrumbEntity<CMSLab>("lab");

  return (
    <div>
      <PageTitle>
        <Loading
          isLoading={isLoading}
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
