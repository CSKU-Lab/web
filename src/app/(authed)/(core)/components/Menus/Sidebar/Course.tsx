import { GetSidebarResponse } from "~/services/core-sidebar.service";
import type { SidebarCourse } from "../../../types";
import CourseItem from "./CourseItem";
import NavChevron from "./NavChevron";

const Course = ({ name, id, status, sub_items }: GetSidebarResponse) => {
  const _icon = "📚";

  return (
    <NavChevron href={`/sections/${id}`} _icon={_icon} name={name}>
      <div className="space-y-3">
        <p className="text-xs text-(--gray-10)">Labs</p>

        <div className="space-y-4">
          {sub_items.map(({ name, sub_items, status, id: labID }) => (
            <NavChevron
              key={id + labID}
              href={`/sections/${id}/labs/${labID}`}
              name={name}
            >
              <CourseItem
                name={name}
                sub_items={sub_items}
                status={status}
                id={labID}
                sectionID={id}
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
