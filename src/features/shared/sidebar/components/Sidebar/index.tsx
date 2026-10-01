"use client";
import Course from "./Course";
import SearchBar from "./SearchBar";
import { useSidebar } from "~/hooks/useSidebar";
import { Skeleton } from "~/components/ui/skeleton";

function SidebarSkeleton() {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Skeleton className="h-9 w-full rounded-md" />
      <Skeleton className="h-3 w-20 mt-5" />
      <div className="flex flex-col gap-5 mt-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Sidebar() {
  const { data: sidebarData, isLoading, isError } = useSidebar();

  if (isLoading) {
    return <SidebarSkeleton />;
  }
  if (isError || !sidebarData) {
    return <div>Error loading sidebar.</div>;
  }
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <SearchBar />
      <h6 className="text-xs text-(--gray-11) font-light">My Courses</h6>
      <div className="relative flex-1 min-h-0">
        <div className="h-full overflow-y-auto flex flex-col gap-4 mt-3 pb-10">
          {sidebarData.map((data) => (
            <Course
              key={data.id}
              name={data.name}
              id={data.id}
              course_name={data.course_name}
              sub_items={data.sub_items}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-(--gray-2) to-(--gray-2)/0 pointer-events-none" />
      </div>
    </div>
  );
}

export default Sidebar;
