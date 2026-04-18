"use client";

import { useState } from "react";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import PublicCourseList from "./_components/PublicCourseList";

function CoursesPage() {
  const [search, setSearch] = useState("");

  const debouncedSearch = useInputDebounce(search, 1000);

  return (
    <div className="@container bg-(--gray-1) h-full p-4 gap-6 flex flex-col w-full">
      <div className="flex justify-between items-center gap-4">
        <h4 className="text-3xl font-semibold">Course Explorer</h4>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search courses..."
          className=""
        />
      </div>
      <PublicCourseList search={debouncedSearch} />
    </div>
  );
}

export default CoursesPage;