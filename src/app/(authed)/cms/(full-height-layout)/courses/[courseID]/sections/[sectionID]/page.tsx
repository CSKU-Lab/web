"use client";
import DeleteSelectedStudents from "./_components/DeleteSelectedStudents";
import StudentBlock from "./_components/StudentBlock";
import ToggleSelectAllStudents from "./_components/ToggleSelectAllStudents";
import AddOrImportStudents from "./_components/AddOrImportStudents";
import useGetStudents from "./_hooks/useGetStudents";
import { useParams } from "next/navigation";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import RouteNavigation from "./_components/RouteNavigation";

function SectionStudentPage() {
  const { sectionID } = useParams<{ sectionID: string }>();
  const { data: students, isFetching } = useGetStudents(sectionID);

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
            {students?.map((student) => (
              <StudentBlock key={student.id} student={student} />
            ))}
          </Loading>
        </div>
      </div>
    </>
  );
}

export default SectionStudentPage;
