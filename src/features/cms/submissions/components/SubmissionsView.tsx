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
import { useMutation } from "@tanstack/react-query";
import { cmsSubmissionService } from "~/services/cms-submission.service";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import { MaterialType } from "~/types/cms-material";

interface PageParams {
  [key: string]: string;
  courseID: string;
  sectionID: string;
  labID: string;
  materialID: string;
}

function SubmissionsView() {
  const { courseID, sectionID, labID, materialID } = useParams<PageParams>();

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

  const regradeAll = useMutation({
    mutationFn: () =>
      cmsSubmissionService.regradeAll(sectionID, labID, materialID),
    onSuccess: () => {
      toast.success("Regrading in progress");
    },
    onError: () => {
      toast.error("Failed to trigger regrade");
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
