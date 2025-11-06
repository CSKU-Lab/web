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
        className="mt-4 mb-8 ml-4 transition-all"
        menus={[
          {
            name: "Sections",
            href: "/cms/courses/:courseID",
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
      {children}
    </div>
  );
}

export default CourseLayout;
