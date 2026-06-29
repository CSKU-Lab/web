"use client";

import { useParams } from "next/navigation";
import { LabSection } from "~/features/core/sections/components/LabSection";
import useCoreLabInfPagination from "~/features/core/sections/hooks/useCoreLabInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { LabItemSkeleton } from "~/features/core/sections/components/LabItemSkeleton";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import { ServerCrash } from "lucide-react";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import type { IFilter } from "~/types/filter";

interface Props {
  search: string;
  filters: IFilter[];
}

export default function LabList({ search, filters }: Props) {
  const { sectionID } = useParams<{ sectionID: string }>();
  const {
    data: labPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = useCoreLabInfPagination({
    page_size: 12,
    search,
    sort_by: "position",
    sort_order: "asc",
    filters,
  });

  const isNoData =
    labPagination.pages.every((page) => page.data.length === 0) && !isFetching;

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <div className="flex flex-col flex-1 mt-6">
      <Error
        isError={isError && !isFetching}
        fallback={
          <ErrorFallback
            icon={<ServerCrash size="2rem" />}
            onRetry={refetch}
            title="Cannot get the labs"
            message="There was an error to get the labs. Please try again later or report issue"
          />
        }
      >
        {isNoData ? (
          <NoDataAvailable />
        ) : (
          <div className="flex flex-col gap-10">
            {labPagination.pages.map((page) =>
              page.data.map(
                ({
                  id,
                  name,
                  readonly_at,
                  status,
                  student_status,
                  total_materials,
                  completed_materials,
                }) => (
                  <LabSection
                    key={id}
                    id={id}
                    name={name}
                    sectionID={sectionID}
                    readonlyAt={readonly_at}
                    status={status}
                    studentStatus={student_status}
                    totalMaterials={total_materials}
                    completedMaterials={completed_materials}
                  />
                ),
              ),
            )}

            {isFetching &&
              Array.from({ length: 4 }).map((_, index) => (
                <LabItemSkeleton key={`skeleton-${index}`} />
              ))}

            <div ref={bottomDivRef} className="h-20" />
          </div>
        )}
      </Error>
    </div>
  );
}
