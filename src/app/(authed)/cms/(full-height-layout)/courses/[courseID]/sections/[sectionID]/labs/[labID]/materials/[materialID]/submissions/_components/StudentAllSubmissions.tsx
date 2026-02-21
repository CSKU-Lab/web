import { Skeleton } from "~/components/ui/skeleton";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedStudentAtom } from "../_stores/selected-student.store";
import { Button } from "~/components/commons/Button";
import { ArrowLeft } from "lucide-react";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import SubmissionCard from "./SubmissionCard";
import { useStudentSubmissions } from "../_hooks/useViewAllSubmissions";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useVimMotion from "../_hooks/useVimMotion";
import useGetUser from "~/hooks/useGetUser";
import { useEffect, useRef } from "react";
import { selectedSubmissionAtom } from "../_stores/selected-submission.store";
import useOnElementAppear from "~/hooks/useOnElementAppear";

function StudentAllSubmissions() {
  const isLoading = false;
  const { sectionID, labID, materialID } = useParams<{
    sectionID: string;
    labID: string;
    materialID: string;
  }>();
  const searchParams = useSearchParams();
  const studentID = searchParams.get("student_id") ?? "";

  const {
    data: submissions,
    hasNextPage,
    fetchNextPage,
  } = useStudentSubmissions({
    sectionID,
    labID,
    materialID,
    student_id: searchParams.get("student_id") ?? "",
  });

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  const allSubmissions = submissions.pages.flatMap((page) => page.data);

  const router = useRouter();
  const handleBackToAll = () => {
    const url = new URL(window.location.href);
    router.push(url.pathname);
  };

  const { currentIndex, setCurrentIndex } = useVimMotion({
    maxIndex: submissions ? allSubmissions.length - 1 : 0,
    registerEvents: {
      Backspace: handleBackToAll,
    },
  });

  const setSelectedSubmission = useSetAtom(selectedSubmissionAtom);

  useEffect(() => {
    if (allSubmissions && allSubmissions[currentIndex]) {
      setSelectedSubmission(allSubmissions[currentIndex]);
    }
  }, [currentIndex, allSubmissions, setSelectedSubmission]);

  const selectedStudent = useAtomValue(selectedStudentAtom);
  const { data: user } = useGetUser({ userId: studentID });

  const student = selectedStudent || user;

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!listRef.current || allSubmissions.length === 0) return;

    const selectedSubmission = allSubmissions[currentIndex];

    const submissionEl = listRef.current.querySelector(
      `[data-submission-id="${selectedSubmission.id}"]`,
    );
    submissionEl?.scrollIntoView({ block: "nearest", });
  }, [currentIndex, allSubmissions]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 pb-4 border-b border-(--gray-4) flex items-center gap-2">
        <Button onClick={handleBackToAll} variant="transparent">
          <ArrowLeft size="1.25rem" />
          Back to All
        </Button>
      </div>

      <div ref={listRef} className="flex-1 min-h-0 overflow-auto">
        {student && (
          <div className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-(--gray-3) hover:bg-(--gray-2) bg-(--gray-3) border-l-2 border-l-accent">
            <UserProfileImage
              username={student.username}
              src={student.profile_image}
              size="2.25rem"
              className="self-start"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h6 className="text-sm font-medium text-(--gray-12) truncate">
                  {student.display_name}
                </h6>
              </div>

              <span className="text-xs text-(--gray-11) truncate">
                @{student.username}
              </span>
            </div>
          </div>
        )}

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
        ) : allSubmissions?.length === 0 ? (
          <div className="py-12">
            <NoDataAvailable />
          </div>
        ) : (
          allSubmissions?.map((submission, i) => (
            <SubmissionCard
              key={submission.created_at}
              submission={submission}
              isSelected={currentIndex === i}
              onClick={() => setCurrentIndex(i)}
            />
          ))
        )}
        <div ref={bottomDivRef}></div>
      </div>
    </div>
  );
}

export default StudentAllSubmissions;
