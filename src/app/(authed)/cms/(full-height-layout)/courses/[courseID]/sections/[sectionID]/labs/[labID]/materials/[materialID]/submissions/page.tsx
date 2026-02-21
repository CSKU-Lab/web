"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, ServerCrash } from "lucide-react";
import Link from "next/link";
import PageTitle from "~/components/commons/PageTitle";
import ResizableSplit from "~/components/commons/ResizableSplit";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import SubmissionDetailPanel from "./_components/SubmissionDetailPanel";
import { FuzzySearchPanel } from "./_components/fuzzy-search";
import { useAllStudentsLatestSubmissions } from "./_hooks/useStudentSubmissions";
import { useGetMaterial } from "./_hooks/useGetMaterial";
import LeftPanel from "./_components/LeftPanel";

interface PageParams {
  [key: string]: string;
  courseID: string;
  sectionID: string;
  labID: string;
  materialID: string;
}

function Page() {
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
  } = useGetMaterial({ materialID });

  const isLoading = isStudentsLoading || isMaterialLoading;
  const isError = (isStudentsError && !isStudentsFetching) || isMaterialError;

  return (
    <>
      <Link
        href={`/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}`}
        className="inline-flex items-center gap-2 text-sm text-(--gray-11) hover:text-(--gray-12) mb-2 transition-colors ml-4 my-2.5"
      >
        <ArrowLeft size={16} />
        <span>Back to Materials</span>
      </Link>
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

export default Page;
