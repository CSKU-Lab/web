"use client";
import Course from "./Course";
import SearchBar from "./SearchBar";
import { useSidebar } from "~/hooks/useSidebar";

function Sidebar() {
  const { data: sidebarData, isLoading, isError } = useSidebar();

  if (isLoading) {
    return <div>Loading sidebar...</div>;
  }
  if (isError || !sidebarData) {
    return <div>Error loading sidebar.</div>;
  }
  return (
    <>
      <SearchBar />
      <h6 className="text-xs text-(--gray-11) font-light">My Courses</h6>
      <div className="flex flex-col gap-4 mt-3">
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
