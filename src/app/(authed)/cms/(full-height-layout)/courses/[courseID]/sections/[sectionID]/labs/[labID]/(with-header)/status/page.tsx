"use client";

import { useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import SearchInput from "~/components/commons/SearchInput";
import { useParams } from "next/navigation";
import { useLabStatus } from "./_hooks/useLabStatus";
import { StudentStatusGrid } from "./_components/StudentStatusGrid";
import useResolvePath from "~/hooks/useResolvePath";

type FilterOption = "all" | "has_failed" | "not_submitted";

const statusLegend = [
  { label: "Passed", className: "bg-(--grass-9)", value: "passed" },
  { label: "Failed", className: "bg-(--tomato-9)", value: "failed" },
  {
    label: "Not Submitted",
    className: "bg-(--gray-4)",
    value: "not_submitted",
  },
];

function Page() {
  const { sectionID, labID } = useParams<{
    sectionID: string;
    labID: string;
  }>();
  const { data, isLoading, isError } = useLabStatus({ sectionID, labID });
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [hoveredMaterialIndex, setHoveredMaterialIndex] = useState<
    number | null
  >(null);

  const onHoverMaterial = (index: number | null) => {
    setHoveredMaterialIndex(index);
  };

  const getPath = useResolvePath();
  const baseURL = getPath(
    "/cms/courses/:courseID/sections/:sectionID/labs/:labID",
  );

  const filteredData = useMemo(() => {
    if (!data) return [];

    let students = data.student_rows;

    if (globalFilter) {
      const search = globalFilter.toLowerCase();
      students = students.filter(
        (s) =>
          s.username.toLowerCase().includes(search) ||
          s.display_name.toLowerCase().includes(search),
      );
    }

    if (filterOption !== "all") {
      students = students.filter((s) => {
        const materialStatuses = Object.values(s.material_statuses);
        if (filterOption === "has_failed") {
          return materialStatuses.some((sub) => sub.status === "failed");
        }
        if (filterOption === "not_submitted") {
          return materialStatuses.some((sub) => sub.status === "not_submitted");
        }
        return true;
      });
    }

    return students;
  }, [data, globalFilter, filterOption]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-(--gray-10)">Loading...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-(--red-11)">
        Failed to load status data
      </div>
    );
  }

  return (
    <div className="space-y-4 flex-1 flex flex-col px-4">
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={globalFilter}
          onChange={(value: string) => setGlobalFilter(value)}
          placeholder="Search students..."
          className="max-w-xs"
        />
        <div className="flex items-center gap-4">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value as FilterOption)}
            className="px-3 py-1.5 text-sm border border-(--gray-4) rounded-md bg-(--gray-1) text-(--gray-12)"
          >
            <option value="all">All</option>
            <option value="has_failed">Has Failed</option>
            <option value="not_submitted">Not Submitted</option>
          </select>
          <div className="flex items-center gap-3 text-xs text-(--gray-11)">
            {statusLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded-sm", item.className)} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-(--gray-4) rounded-md overflow-hidden">
        <div className="flex items-center gap-4 py-2 px-3 bg-(--gray-2) border-b border-(--gray-4)">
          <div className="w-[140px] shrink-0 text-xs font-medium text-(--gray-11)">
            Student
          </div>
          <div className="flex-1 shrink-0 text-xs font-medium text-(--gray-11)">
            Status
          </div>
        </div>
        <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
          {filteredData.map((student) => (
            <StudentStatusGrid
              key={student.id}
              student={student}
              materials={data.material_cols}
              hoveredMaterialIndex={hoveredMaterialIndex}
              onHoverMaterial={onHoverMaterial}
              baseUrl={baseURL}
            />
          ))}
          {filteredData.length === 0 && (
            <div className="py-8 text-center text-(--gray-10)">
              No students found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
