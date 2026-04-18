"use client";

import { useState } from "react";
import LabList from "./_components/LabList";
import SectionHeader from "./_components/SectionHeader";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import { IFilter } from "~/types/filter";

function MainCoursePage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<IFilter[]>([]);

  const debouncedSearch = useInputDebounce(search, 1000);

  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <SectionHeader />
      <div className="px-4 lg:px-12 py-4 flex flex-col flex-1">
        <div className="flex justify-between items-center gap-4">
          <h4 className="font-semibold text-2xl h-fit">Labs</h4>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search labs..."
            className=""
          />
        </div>
        <LabList search={debouncedSearch} filters={filters} />
      </div>
    </div>
  );
}

export default MainCoursePage;
