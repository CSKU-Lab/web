import { GetSidebarResponse } from "~/services/core-sidebar.service";
import CourseItem from "./CourseItem";
import NavChevron from "./NavChevron";
import { useSidebarLabs } from "~/hooks/useSidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { useState } from "react";

function SidebarLab({ sectionID, labID, name }: { sectionID: string; labID: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavChevron name={name} onOpenChange={setIsOpen}>
      <CourseItem sectionID={sectionID} labID={labID} enabled={isOpen} />
    </NavChevron>
  );
}

const Course = ({
  name,
  id,
  course_name,
}: GetSidebarResponse & { course_name?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: labs = [], isLoading } = useSidebarLabs(id, isOpen);
  const displayName = course_name ?? name;

  return (
    <NavChevron
      href={`/sections/${id}`}
      name={displayName}
      subtitle={name}
      onOpenChange={setIsOpen}
    >
      <div className="space-y-3">
        <p className="text-xs text-(--gray-10)">Labs</p>

        <div className="space-y-4">
          {isLoading ? [0, 1, 2].map((item) => (
            <div key={item} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          )) : labs.map((lab) => (
            <SidebarLab
              key={lab.id}
              name={lab.name}
              sectionID={id}
              labID={lab.id}
            />
          ))}
        </div>
      </div>
    </NavChevron>
  );
};

export default Course;
