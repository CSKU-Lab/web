"use client";

import { LabItem } from "./LabItem";
import useCoreLabInfPagination from "../_hooks/useCoreLabInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { LabItemSkeleton } from "./LabItemSkeleton";
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {labPagination.pages.map((page) =>
              page.data.map(
                ({
                  id,
                  name,
                  closed_at,
                  status,
                  student_status,
                  total_materials,
                  completed_materials,
                }) => (
                  <LabItem
                    key={id}
                    id={id}
                    name={name}
                    closedAt={closed_at}
                    status={status}
                    studentStatus={student_status}
                    totalMaterials={total_materials}
                    completedMaterials={completed_materials}
                  />
                ),
              ),
            )}

            {isFetching &&
              Array.from({ length: 8 }).map((_, index) => (
                <LabItemSkeleton key={`skeleton-${index}`} />
              ))}

            <div ref={bottomDivRef} className="h-20" />
          </div>
        )}
      </Error>
    </div>
  );
}
