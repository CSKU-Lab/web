"use client";
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

export default function LabList() {
  const { sectionID } = useParams<{ sectionID: string }>();

  const {
    data: labPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = useCoreLabInfPagination({
    page_size: 5,
    sort_by: "position",
    sort_order: "asc",
    filters: [],
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {labPagination.pages.map((page) =>
              page.data.map(({ id, lab_name, lab_id }) => (
                <LabItem key={id} id={lab_id} name={lab_name}>
                  <div className="flex flex-col text-xs mt-4">
                    <p>Posted: 04/12/2025</p>
                    <p>Due date: 12/12/2025</p>
                  </div>
                </LabItem>
              )),
            )}

            {isFetching &&
              Array.from({ length: 3 }).map((_, index) => (
                <LabItemSkeleton key={`skeleton-${index}`} />
              ))}

            <div ref={bottomDivRef} className="h-20" />
          </div>
        )}
      </Error>
    </div>
  );
}
