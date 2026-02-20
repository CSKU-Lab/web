import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Sparkles } from "lucide-react";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";
import StudentCard from "./StudentCard";
import SearchInput from "~/components/commons/SearchInput";
import { useState, useMemo, useEffect, useRef } from "react";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { useAtom } from "jotai";
import { selectedStudentIdAtom } from "../_stores/selected-student.store";
import { fuzzySearchOpenAtom } from "../_stores/fuzzy-search.store";

interface StudentListProps {
  students: CMSSectionStudentSubmission[];
  isLoading: boolean;
}

function StudentList({ students, isLoading }: StudentListProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useAtom(selectedStudentIdAtom);
  const [, setFuzzySearchOpen] = useAtom(fuzzySearchOpenAtom);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastGPressRef = useRef<number>(0);

  const filteredStudents = useMemo(() => {
    if (!search) return students;
    const query = search.toLowerCase();
    return students.filter(
      (s) =>
        s.student.display_name.toLowerCase().includes(query) ||
        s.student.username.toLowerCase().includes(query),
    );
  }, [students, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTypingField =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute("contenteditable") === "true";

      if (e.key === "Escape" && isTypingField) {
        e.preventDefault();
        searchRef.current?.blur();
        const firstStudent = filteredStudents[0];
        if (firstStudent) {
          setSelectedId(firstStudent.student.id);
        }
        setSearch("");
        return;
      }

      if (isTypingField && e.key !== "/") {
        return;
      }

      if (!["j", "k", "g", "G", "/"].includes(e.key)) return;

      e.preventDefault();

      const now = Date.now();

      if (e.key === "/") {
        setSearch("");
        searchRef.current?.focus();
        return;
      }

      if (e.key === "G") {
        const lastStudent = filteredStudents[filteredStudents.length - 1];
        if (lastStudent) {
          setSelectedId(lastStudent.student.id);
        }
        return;
      }

      if (e.key === "g") {
        if (now - lastGPressRef.current < 500) {
          const firstStudent = filteredStudents[0];
          if (firstStudent) {
            setSelectedId(firstStudent.student.id);
          }
          lastGPressRef.current = 0;
        } else {
          lastGPressRef.current = now;
        }
        return;
      }

      const currentIndex = filteredStudents.findIndex(
        (s) => s.student.id === selectedId,
      );

      let newIndex: number;

      if (e.key === "j") {
        if (currentIndex === -1) {
          newIndex = 0;
        } else {
          newIndex = Math.min(currentIndex + 1, filteredStudents.length - 1);
        }
      } else {
        if (currentIndex === -1) {
          newIndex = filteredStudents.length - 1;
        } else {
          newIndex = Math.max(currentIndex - 1, 0);
        }
      }

      const newStudent = filteredStudents[newIndex];
      if (newStudent) {
        setSelectedId(newStudent.student.id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredStudents, selectedId, setSelectedId]);

  useEffect(() => {
    if (!selectedId || !listRef.current) return;

    const studentEl = listRef.current.querySelector(
      `[data-student-id="${selectedId}"]`,
    );
    studentEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFuzzySearchOpen(true)}
          className="shrink-0"
        >
          <Sparkles size={16} className="mr-1.5" />
          Fuzzy Search
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
