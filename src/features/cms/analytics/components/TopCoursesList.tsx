"use client";

import type { CourseCount } from "../types";

interface Props {
  data: CourseCount[];
}

function TopCoursesList({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-32 items-center justify-center text-sm text-(--gray-10)">
        No submissions in range
      </div>
    );
  }

  const max = Math.max(...data.map((c) => c.count));

  return (
    <ul className="flex flex-col gap-3">
      {data.map((course) => (
        <li key={course.course_id} className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate text-(--gray-12)">{course.name}</span>
            <span className="shrink-0 tabular-nums text-(--gray-11)">
              {course.count.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-(--gray-4)">
            <div
              className="h-full rounded-full bg-(--blue-9)"
              style={{ width: `${max > 0 ? (course.count / max) * 100 : 0}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TopCoursesList;
