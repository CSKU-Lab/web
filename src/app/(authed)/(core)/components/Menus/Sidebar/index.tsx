"use client";
import { useRouter } from "next/navigation";
import Course from "./Course";
import { useSidebar } from "~/hooks/useSidebar";

function Sidebar() {
  const router = useRouter();
  const { data: sidebarData, isLoading, isError } = useSidebar();

  const handleHomeClick = () => {
    router.push(`/`);
  };

  if (isLoading) {
    return <div>Loading sidebar...</div>;
  }
  if (isError || !sidebarData) {
    return <div>Error loading sidebar.</div>;
  }
  return (
    <>
      <button onClick={handleHomeClick}>
        <h6 className="text-(--gray-11) text-sm font-light py-2">My Courses</h6>
      </button>
      <div className="flex flex-col gap-4 mt-2">
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
