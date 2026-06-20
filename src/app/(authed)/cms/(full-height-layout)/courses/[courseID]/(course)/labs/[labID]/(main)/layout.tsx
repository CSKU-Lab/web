"use client";
import { useParams } from "next/navigation";
import type { ChildrenProps } from "~/types/children-props";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import PageTitle from "~/components/commons/PageTitle";
import NavigationMenus from "~/features/cms/layout/components/nav/NavigationMenus";
import { useBreadcrumbEntity } from "~/features/cms/layout/components/nav/BreadcrumbProvider";
import type { CMSLab } from "~/types/cms-lab";
import { useSession } from "~/providers/SessionProvider";
import useGetCourse from "~/features/cms/courses/hooks/useGetCourse";

const allMenus = [
  { name: "Materials", href: "/cms/courses/:courseID/labs/:labID" },
  { name: "Settings", href: "/cms/courses/:courseID/labs/:labID/settings" },
];

export default function LabLayout({ children }: ChildrenProps) {
  const { data: lab, isLoading } = useBreadcrumbEntity<CMSLab>("lab");
  const { courseID } = useParams<{ courseID: string }>();
  const { user } = useSession();
  const { data: course } = useGetCourse({ courseID });
  const isInstructor = user.roles.includes("instructor") && !user.roles.includes("admin");
  const isCourseCreator = course?.creators?.some((c) => c.id === user.sub);
  const isRestrictedInstructor = isInstructor && !isCourseCreator;

  const menus = isRestrictedInstructor
    ? allMenus.filter((m) => m.name !== "Settings")
    : allMenus;

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

      <NavigationMenus menus={menus} />
      {children}
    </div>
  );
}
