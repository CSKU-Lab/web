"use client";

import { useState } from "react";
import { LabItem } from "./LabItem";
import useCoreLabInfPagination from "../_hooks/useCoreLabInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { LabItemSkeleton } from "./LabItemSkeleton";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import { ServerCrash } from "lucide-react";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { useParams } from "next/navigation";
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

  const queryClient = useQueryClient();

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
          <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @6xl:grid-cols-4 gap-4">
            {labPagination.pages.map((page) =>
              page.data.map(({ id, lab_name, lab_id, opened_at, closed_at }) => (
                <LabItem
                  key={id}
                  id={lab_id}
                  name={lab_name}
                  openedAt={opened_at}
                  closedAt={closed_at}
                />
              )),
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
