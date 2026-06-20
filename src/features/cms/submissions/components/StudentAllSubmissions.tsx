import { Skeleton } from "~/components/ui/skeleton";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedStudentAtom } from "~/features/cms/submissions/stores/selected-student.store";
import { Button } from "~/components/commons/Button";
import { ArrowLeft, Trash2 } from "lucide-react";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import SubmissionCard from "~/features/cms/submissions/components/SubmissionCard";
import { useStudentSubmissions } from "~/features/cms/submissions/hooks/useViewAllSubmissions";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useVimMotion from "~/features/cms/submissions/hooks/useVimMotion";
import useGetUser from "~/hooks/useGetUser";
import { useEffect, useRef, useState } from "react";
import { selectedSubmissionAtom } from "~/features/cms/submissions/stores/selected-submission.store";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsSubmissionService } from "~/services/cms-submission.service";
import { toast } from "sonner";
import { queryKeys } from "~/queryKeys";
import { CMSSectionSubmission } from "~/types/cms-section-submission";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/commons/Dialog";

function StudentAllSubmissionsSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 pb-4 border-b border-(--gray-4) flex items-center gap-2">
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-(--gray-3) bg-(--gray-3) border-l-2 border-l-accent">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        </div>

        <div className="space-y-1 p-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-2 hover:bg-(--gray-3) w-full">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentAllSubmissions() {
  const { sectionID, labID, materialID } = useParams<{
    sectionID: string;
    labID: string;
    materialID: string;
  }>();
  const searchParams = useSearchParams();
  const studentID = searchParams.get("student_id") ?? "";
  const [submissionToDelete, setSubmissionToDelete] =
    useState<CMSSectionSubmission | null>(null);
  const queryClient = useQueryClient();

  const deleteSubmission = useMutation({
    mutationFn: (submissionID: string) =>
      cmsSubmissionService.deleteSubmission(submissionID),
    onSuccess: () => {
      toast.success("Submission deleted");
      setSubmissionToDelete(null);
      queryClient.invalidateQueries({
        queryKey: queryKeys.section.submissionsOfStudent(
          sectionID,
          labID,
          materialID,
          studentID,
        ),
      });
    },
    onError: () => {
      toast.error("Failed to delete submission");
    },
  });

  const {
    data: submissions,
    hasNextPage,
    isFetching: isLoading,
    isInitialLoading,
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
    submissionEl?.scrollIntoView({ block: "center" });
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

        {isInitialLoading && allSubmissions.length === 0 ? (
          <StudentAllSubmissionsSkeleton />
        ) : allSubmissions?.length === 0 ? (
          <div className="py-12">
            <NoDataAvailable />
          </div>
        ) : (
          <div className="ml-1.5">
            {allSubmissions?.map((submission, i) => (
              <SubmissionCard
                key={submission.created_at}
                submission={submission}
                isSelected={currentIndex === i}
                onClick={() => setCurrentIndex(i)}
                onDelete={setSubmissionToDelete}
              />
            ))}
            {isLoading && hasNextPage && (
              <div className="p-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-2 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!isLoading && !hasNextPage && allSubmissions.length > 0 && (
              <div className="py-4 text-center text-xs text-(--gray-10)">
                End of results
              </div>
            )}
          </div>
        )}
        <div ref={bottomDivRef}></div>
      </div>

      <Dialog
        open={submissionToDelete !== null}
        onOpenChange={(open) => !open && setSubmissionToDelete(null)}
      >
        <DialogContent>
          <DialogHeader className="p-4">
            <DialogTitle>Confirm Delete?</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <DialogDescription>
              Submission #{submissionToDelete?.order} will be permanently
              deleted. The grade will revert to the previous submission, or
              become null if no other submissions exist.
            </DialogDescription>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-full"
              variant="danger"
              disabled={deleteSubmission.isPending}
              onClick={() =>
                submissionToDelete &&
                deleteSubmission.mutate(submissionToDelete.id)
              }
            >
              <Trash2 size="1rem" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentAllSubmissions;
