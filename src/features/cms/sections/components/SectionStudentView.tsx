"use client";
import { useState } from "react";
import DeleteSelectedStudents from "~/features/cms/sections/components/DeleteSelectedStudents";
import StudentBlock from "~/features/cms/sections/components/StudentBlock";
import ToggleSelectAllStudents from "~/features/cms/sections/components/ToggleSelectAllStudents";
import AddOrImportStudents from "~/features/cms/sections/components/AddOrImportStudents";
import useGetStudents from "~/features/cms/sections/hooks/useGetStudents";
import { useParams } from "next/navigation";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import RouteNavigation from "~/features/cms/sections/components/RouteNavigation";
import SearchInput from "~/components/commons/SearchInput";

function SectionStudentView() {
  const { sectionID } = useParams<{ sectionID: string }>();
  const { data: students, isFetching } = useGetStudents(sectionID);
  const [search, setSearch] = useState("");

  const filteredStudents = students?.filter((s) => {
    const q = search.toLowerCase();
    return s.username.toLowerCase().includes(q) || s.display_name.toLowerCase().includes(q);
  });

  return (
    <>
      <RouteNavigation title="Students" />
      <div className="p-4">
        <Loading
          isLoading={isFetching}
          fallback={<Skeleton className="w-28 h-7" />}
        >
          <h5 className="font-medium">
            Student{(students?.length ?? 0) > 1 ? "s" : ""} (
            {students?.length ?? 0})
          </h5>
        </Loading>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1">
            <AddOrImportStudents />
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search students..."
          />
          {students !== undefined && (
            <ToggleSelectAllStudents students={students} />
          )}
          <DeleteSelectedStudents />
        </div>
        <div className="mt-8 grid grid-cols-4 gap-4">
          <Loading
            isLoading={isFetching}
            fallback={Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-44" />
            ))}
          >
            {filteredStudents?.map((student) => (
              <StudentBlock key={student.id} student={student} />
            ))}
          </Loading>
        </div>
      </div>
    </>
  );
}

export default SectionStudentView;
