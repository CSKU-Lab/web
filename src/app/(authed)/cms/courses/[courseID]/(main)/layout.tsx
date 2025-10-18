"use client"
import type { ChildrenProps } from "~/types/children-props";
import useGetCourse from "../_hooks/useGetCourse";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import NavigationMenus from "../../../_components/NavigationMenus";
import { useParams } from "next/navigation";

function CourseLayout({ children }: ChildrenProps) {
  const { courseID } = useParams<{ courseID: string }>();
  const { data: course, isFetching } = useGetCourse({ courseID });
  return (
    <div>
      <Loading
        isLoading={isFetching}
        fallback={<Skeleton className="w-64 h-8" />}
      >
        <h3 className="text-xl font-medium">{course?.name}</h3>
      </Loading>
      <NavigationMenus
        className="mt-4 mb-8"
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
