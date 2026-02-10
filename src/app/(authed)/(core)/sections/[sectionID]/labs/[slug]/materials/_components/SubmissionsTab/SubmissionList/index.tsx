import React, { Fragment } from "react";
import { useAtom } from "jotai";
import { Inbox } from "lucide-react";
import { SubmissionCard } from "./SubmissionCard/SubmissionCard";
import { SubmissionCardSkeletonList } from "./SubmissionCard/SubmissionCardSkeleton";
import useMaterialSubmissionPagination from "../../../[materialID]/_hooks/useMaterialSubmisionPagination";
import type { CodeSubmissionOverview } from "~/types/core-code-submission";
import { submissionAtom } from "~/globalStore/submissions";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { SUBMISSION_PAGE_SIZE } from "../../../_constants/submissions";

function SubmissionList() {
  const [_, setSubmissionAtom] = useAtom(submissionAtom);

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useMaterialSubmissionPagination<CodeSubmissionOverview>({});

  const submissions = data?.pages.flatMap((page) => page.data) || [];
  const totalRows = data?.pages[0]?.pagination.total_rows ?? 0;

  const loadMoreRef = useOnElementAppear({
    onAppear: () => {
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetching,
  });

  const showSkeleton = isFetching && submissions.length === 0;

  if (showSkeleton) {
    return <SubmissionCardSkeletonList count={3} />;
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-12 text-(--gray-11)">
        <Inbox className="h-12 w-12 mb-4" />
        <p className="text-sm">No submissions yet. Try to submit a code</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page, pageIndex) => (
        <Fragment key={pageIndex}>
          {page.data.map((submission, index) => {
            const order = totalRows - pageIndex * SUBMISSION_PAGE_SIZE - index;
            return (
              <SubmissionCard
                key={submission.id}
                order={order}
                status={submission.status}
                createdAt={submission.created_at}
                correctCase={
                  (submission.payload as CodeSubmissionOverview | undefined)
                    ?.passed_test_cases
                }
                totalCase={
                  (submission.payload as CodeSubmissionOverview | undefined)
                    ?.total_test_cases
                }
                onClick={() =>
                  setSubmissionAtom({ selectedSubmissionId: submission.id })
                }
              />
            );
          })}
        </Fragment>
      ))}
      {hasNextPage && (
        <div ref={loadMoreRef}>
          <SubmissionCardSkeletonList count={1} />
        </div>
      )}
    </div>
  );
}

export default SubmissionList;
