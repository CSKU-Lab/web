"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw, ServerCrash } from "lucide-react";
import Link from "next/link";
import PageTitle from "~/components/commons/PageTitle";
import ResizableSplit from "~/components/commons/ResizableSplit";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import SubmissionDetailPanel from "~/features/cms/submissions/components/SubmissionDetailPanel";
import { FuzzySearchPanel } from "~/features/cms/submissions/components/fuzzy-search";
import { useAllStudentsLatestSubmissions } from "~/features/cms/submissions/hooks/useStudentSubmissions";
import { useGetMaterial } from "~/features/cms/submissions/hooks/useGetMaterial";
import LeftPanel from "~/features/cms/submissions/components/LeftPanel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsSubmissionService } from "~/services/cms-submission.service";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import { MaterialType } from "~/types/cms-material";
import { queryKeys } from "~/queryKeys";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { selectedSubmissionAtom } from "~/features/cms/submissions/stores/selected-submission.store";

interface PageParams {
  [key: string]: string;
  courseID: string;
  sectionID: string;
  labID: string;
  materialID: string;
}

function SubmissionsView() {
  const { courseID, sectionID, labID, materialID } = useParams<PageParams>();

  // selectedSubmissionAtom is a global jotai atom that outlives client-side
  // navigation between materials (Next reuses this component across [materialID]
  // changes). Clear it when the material changes so a stale submission from the
  // previous material's type is never fed into the new material's renderer,
  // which would crash on the mismatched payload shape. StudentList re-selects
  // the first student once the new list loads.
  const setSelectedSubmission = useSetAtom(selectedSubmissionAtom);
  useEffect(() => {
    setSelectedSubmission(null);
  }, [materialID, setSelectedSubmission]);

  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    refetch: refetchStudents,
    isFetching: isStudentsFetching,
  } = useAllStudentsLatestSubmissions({ sectionID, labID, materialID });

  const {
    data: material,
    isLoading: isMaterialLoading,
    isError: isMaterialError,
    refetch: refetchMaterial,
  } = useGetMaterial({ courseID, materialID });

  const isLoading = isStudentsLoading || isMaterialLoading;
  const isError = (isStudentsError && !isStudentsFetching) || isMaterialError;

  const queryClient = useQueryClient();

  const regradeAll = useMutation({
    mutationFn: () =>
      cmsSubmissionService.regradeAll(sectionID, labID, materialID),
    onSuccess: () => {
      toast.success("Regrading in progress");
      // The API returns 202 and flips submissions to "queued" in a background
      // job, so the list is still terminal at this point. Re-fetch on a short
      // stagger to catch the async flip — once any row shows queued/running the
      // list query self-sustains its polling until everything is terminal again.
      const submissionsKey = queryKeys.section.submissions(
        sectionID,
        labID,
        materialID,
      );
      const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: submissionsKey });
      invalidate();
      setTimeout(invalidate, 1500);
      setTimeout(invalidate, 4000);
    },
    onError: () => {
      toast.error("Failed to trigger regrade");
    },
  });

  const regradeInputs = useMutation({
    mutationFn: () => cmsSubmissionService.regradeInputs(courseID, materialID),
    onSuccess: (res) => {
      toast.success(
        `Regraded ${res.regraded} submission${res.regraded === 1 ? "" : "s"}` +
          (res.skipped > 0 ? ` · ${res.skipped} skipped` : ""),
      );
      // Regrade is synchronous and already terminal, so a single invalidate
      // refreshes the list with the new scores.
      queryClient.invalidateQueries({
        queryKey: queryKeys.section.submissions(sectionID, labID, materialID),
      });
    },
    onError: () => {
      toast.error("Failed to regrade");
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          href={`/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}`}
          className="inline-flex items-center gap-2 text-sm text-(--gray-11) hover:text-(--gray-12) mb-2 transition-colors ml-4 my-2.5"
        >
          <ArrowLeft size={16} />
          <span>Back to Materials</span>
        </Link>
        {material?.type === MaterialType.CODE && (
          <Button
            variant="ghost"
            className="mr-4 h-8 text-sm"
            disabled={regradeAll.isPending}
            onClick={() => regradeAll.mutate()}
          >
            <RefreshCw size="0.875rem" />
            Regrade All
          </Button>
        )}
        {material?.type === MaterialType.DOCUMENT && (
          <Button
            variant="ghost"
            className="mr-4 h-8 text-sm"
            disabled={regradeInputs.isPending}
            onClick={() => regradeInputs.mutate()}
          >
            <RefreshCw size="0.875rem" />
            Regrade All
          </Button>
        )}
      </div>
      <PageTitle>
        <Loading
          isLoading={isMaterialLoading}
          fallback={<Skeleton className="h-7 w-48" />}
        >
          {material?.name ?? "Submissions"}
        </Loading>
      </PageTitle>

      {!!material && material?.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 ml-4">
          {material.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-(--gray-3) text-(--gray-11)"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 mt-4">
        <Error
          isError={isError}
          fallback={
            <ErrorFallback
              icon={<ServerCrash size="2rem" />}
              onRetry={() => {
                refetchStudents();
                refetchMaterial();
              }}
              title="Cannot load submissions"
              message="There was an error loading the submission data. Please try again later."
            />
          }
        >
          <ResizableSplit
            initialRatio={0.35}
            minRatio={0.2}
            maxRatio={0.6}
            left={<LeftPanel />}
            right={
              <Loading
                isLoading={isLoading}
                fallback={
                  <div className="p-4 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                }
              >
                {material && <SubmissionDetailPanel material={material} />}
              </Loading>
            }
          />
        </Error>
      </div>

      <FuzzySearchPanel
        students={students ?? []}
        materialType={material?.type}
      />
    </>
  );
}

export default SubmissionsView;
