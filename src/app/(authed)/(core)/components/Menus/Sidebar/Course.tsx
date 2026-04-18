import { GetSidebarResponse } from "~/services/core-sidebar.service";
import CourseItem from "./CourseItem";
import NavChevron from "./NavChevron";

const Course = ({
  name,
  id,
  course_name,
  sub_items,
}: GetSidebarResponse & { course_name?: string }) => {
  const labs = sub_items || [];
  const displayName = course_name ?? name;

  return (
    <NavChevron href={`/sections/${id}`} name={displayName} subtitle={name}>
      <div className="space-y-3">
        <p className="text-xs text-(--gray-10)">Labs</p>

        <div className="space-y-4">
          {labs.map((lab) => (
            <NavChevron
              key={lab.id}
              href={`/sections/${id}/labs/${lab.id}`}
              name={lab.name}
            >
              <CourseItem
                sub_items={lab.sub_items}
                sectionID={id}
                labID={lab.id}
              />
            </NavChevron>
          ))}
        </div>
      </div>
    </NavChevron>
  );
};

export default Course;
