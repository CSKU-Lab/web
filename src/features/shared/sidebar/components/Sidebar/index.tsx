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
      <div className="flex flex-col gap-4">
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
