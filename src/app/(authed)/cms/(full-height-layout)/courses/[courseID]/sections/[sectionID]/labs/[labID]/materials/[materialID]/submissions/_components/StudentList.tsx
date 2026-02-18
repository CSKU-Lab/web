import { Skeleton } from "~/components/ui/skeleton";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";
import StudentCard from "./StudentCard";
import SearchInput from "~/components/commons/SearchInput";
import { useState, useMemo } from "react";
import useInputDebounce from "~/hooks/useInputDebounce";
import NoDataAvailable from "~/components/commons/NoDataAvailable";

interface StudentListProps {
  students: CMSSectionStudentSubmission[];
  isLoading: boolean;
}

function StudentList({ students, isLoading }: StudentListProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 300);

  const filteredStudents = useMemo(() => {
    if (!debouncedSearch) return students;
    const query = debouncedSearch.toLowerCase();
    return students.filter(
      (s) =>
        s.student.display_name.toLowerCase().includes(query) ||
        s.student.username.toLowerCase().includes(query),
    );
  }, [students, debouncedSearch]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-(--gray-4)">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search students..."
        />
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {isLoading ? (
          <div className="space-y-1 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-9 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-12">
            <NoDataAvailable />
          </div>
        ) : (
          filteredStudents.map((studentSubmission) => (
            <StudentCard
              key={studentSubmission.student.id}
              studentSubmission={studentSubmission}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default StudentList;
