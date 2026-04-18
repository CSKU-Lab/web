"use client";

import { useState } from "react";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import { Button } from "~/components/commons/Button";
import CourseList from "./components/CourseCard";

type StatusFilter = "active" | "archived" | "all";

function Home() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("active");

  const debouncedSearch = useInputDebounce(search, 1000);

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "archived", label: "Archived" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="@container bg-(--gray-1) h-full p-4 gap-6 flex flex-col w-full">
      <div className="flex justify-between items-center gap-4">
        <h4 className="text-3xl font-semibold">My Courses</h4>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search sections..."
          className=""
        />
      </div>
      <div className="flex gap-2">
        {statusFilters.map(({ key, label }) => (
          <Button
            key={key}
            isActive={status === key}
            onClick={() => setStatus(key)}
            className="shrink-0 px-3 py-1.5"
          >
            {label}
          </Button>
        ))}
      </div>
      <CourseList search={debouncedSearch} status={status} />
    </div>
  );
}

export default Home;
