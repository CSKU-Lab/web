import { Skeleton } from "~/components/ui/skeleton";
import StudentCard from "./StudentCard";
import SearchInput from "~/components/commons/SearchInput";
import { useState, useMemo, useEffect, useRef } from "react";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { useSetAtom } from "jotai";
import { Button } from "~/components/commons/Button";
import { Sparkles } from "lucide-react";
import { fuzzySearchOpenAtom } from "../_stores/fuzzy-search.store";
import { useParams } from "next/navigation";
import { useAllStudentsLatestSubmissions } from "../_hooks/useStudentSubmissions";
import useVimMotion from "../_hooks/useVimMotion";
import { selectedSubmissionAtom } from "../_stores/selected-submission.store";

function StudentList() {
  const [search, setSearch] = useState("");
  const setFuzzySearchOpen = useSetAtom(fuzzySearchOpenAtom);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { sectionID, labID, materialID } = useParams<{
    sectionID: string;
    labID: string;
    materialID: string;
  }>();

  const { data: students, isLoading } = useAllStudentsLatestSubmissions({
    sectionID,
    labID,
    materialID,
  });

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (!search) return students;
    const query = search.toLowerCase();
    return students.filter(
      (s) =>
        s.student.display_name.toLowerCase().includes(query) ||
        s.student.username.toLowerCase().includes(query),
    );
  }, [students, search]);

  const { currentIndex, setCurrentIndex } = useVimMotion({
    maxIndex: filteredStudents.length - 1,
  });

  const setSelectedSubmission = useSetAtom(selectedSubmissionAtom);
  useEffect(() => {
    if (!filteredStudents[currentIndex]) return;
    setSelectedSubmission(filteredStudents[currentIndex]);
  }, [currentIndex, filteredStudents, setSelectedSubmission]);

  useEffect(() => {
    if (!listRef.current || !students) return;

    const selectedStudent = students[currentIndex];

    const studentEl = listRef.current.querySelector(
      `[data-student-id="${selectedStudent.id}"]`,
    );
    studentEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentIndex, students]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-(--gray-4) flex items-center gap-2">
        <SearchInput
          ref={searchRef}
          value={search}
          onChange={setSearch}
          placeholder="Search students..."
          className="flex-1"
        />
        <Button onClick={() => setFuzzySearchOpen(true)} className="shrink-0">
          <Sparkles size={16} className="mr-1.5" />
          Advanced Search
        </Button>
      </div>

      <div ref={listRef} className="flex-1 min-h-0 overflow-auto">
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
          filteredStudents.map((studentSubmission, i) => (
            <StudentCard
              key={studentSubmission.student.id}
              studentSubmission={studentSubmission}
              isSelected={currentIndex === i}
              onClick={() => setCurrentIndex(i)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default StudentList;
