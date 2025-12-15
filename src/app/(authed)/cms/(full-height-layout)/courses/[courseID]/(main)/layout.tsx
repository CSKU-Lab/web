"use client";
import type { ChildrenProps } from "~/types/children-props";
import useGetCourse from "../_hooks/useGetCourse";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import { useParams } from "next/navigation";
import PageTitle from "~/components/commons/PageTitle";
import NavigationMenus from "~/app/(authed)/cms/_components/NavigationMenus";

function CourseLayout({ children }: ChildrenProps) {
  const { courseID } = useParams<{ courseID: string }>();
  const { data: course, isFetching } = useGetCourse({ courseID });
  return (
    <div>
      <PageTitle>
        <Loading
          isLoading={isFetching}
          fallback={<Skeleton className="w-64 h-8" />}
        >
          {course?.name}
        </Loading>
      </PageTitle>
      <NavigationMenus
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
      {children}
    </div>
  );
}

export default CourseLayout;
