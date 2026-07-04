"use client";

import { useState } from "react";
import LabList from "~/features/core/sections/components/LabList";
import SectionHeader from "~/features/core/sections/components/SectionHeader";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import { IFilter } from "~/types/filter";

function SectionView() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<IFilter[]>([]);

  const debouncedSearch = useInputDebounce(search, 1000);

  return (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
      <SectionHeader />
      <div className="px-4 lg:px-12 pb-4 flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
          <h4 className="font-semibold text-xl sm:text-2xl h-fit">Labs</h4>
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

export default SectionView;
