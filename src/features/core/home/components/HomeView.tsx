"use client";

import { useState } from "react";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import CourseList from "~/app/(authed)/(core)/components/CourseCard";

function HomeView() {
  const [search, setSearch] = useState("");

  const debouncedSearch = useInputDebounce(search, 1000);

  return (
    <div className="@container bg-(--gray-1) h-full p-4 gap-6 flex flex-col w-full overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h4 className="text-2xl sm:text-3xl font-semibold">My Courses</h4>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search courses..."
          className=""
        />
      </div>
      <CourseList search={debouncedSearch} />
    </div>
  );
}

export default HomeView;
