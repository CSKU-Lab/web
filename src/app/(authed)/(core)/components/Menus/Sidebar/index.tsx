"use client";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, Compass } from "lucide-react";
import Course from "./Course";
import { useSidebar } from "~/hooks/useSidebar";
import { cn } from "~/lib/utils";

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: sidebarData, isLoading, isError } = useSidebar();

  const isActive = (path: string) => pathname === path;

  const handleHomeClick = () => {
    router.push(`/`);
  };

  const handleExploreClick = () => {
    router.push(`/courses`);
  };

  if (isLoading) {
    return <div>Loading sidebar...</div>;
  }
  if (isError || !sidebarData) {
    return <div>Error loading sidebar.</div>;
  }
  return (
    <>
      <div className="flex flex-col gap-1 mt-4">
        <span className="text-xs text-[var(--gray-9)] tracking-wider">Menus</span>
        <button
          type="button"
          onClick={handleHomeClick}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-(--gray-12) hover:bg-(--gray-3) transition-colors",
            isActive("/") && "bg-(--gray-4) text-(--gray-12)"
          )}
        >
          <BookOpen className="w-4 h-4" />
          <h6 className="font-medium">My Courses</h6>
        </button>
        <button
          type="button"
          onClick={handleExploreClick}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-(--gray-12) hover:bg-(--gray-3) transition-colors",
            isActive("/courses") && "bg-(--gray-4) text-(--gray-12)"
          )}
        >
          <Compass className="w-4 h-4" />
          <h6 className="font-medium">Explore Courses</h6>
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-6">
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
    </>
  );
}

export default Sidebar;
