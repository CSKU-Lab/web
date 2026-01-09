import type { SidebarCourse } from "../../../types";
import CourseItem from "./CourseItem";
import NavChevron from "./NavChevron";

const Course = ({ name, icon, labs, sectionID }: SidebarCourse) => {
  const _icon = icon ?? name[0];

  return (
    <NavChevron href={`/sections/${sectionID}`} _icon={_icon} name={name}>
      <div className="space-y-3">
        <p className="text-xs text-(--gray-10)">Labs</p>

        <div className="space-y-4">
          {labs.map(({ name, subItems, status, labID }) => (
            <NavChevron
              key={labID}
              href={`/sections/${sectionID}/labs/${labID}`}
              name={name}
            >
              <CourseItem
                name={name}
                subItems={subItems}
                status={status}
                labID={labID}
                sectionID={sectionID}
                type="materials"
              />
            </NavChevron>
          ))}
        </div>
      </div>
    </NavChevron>
  );
};

export default Course;
