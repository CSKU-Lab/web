"use client";

import { useState } from "react";
import { Plus, ServerCrash } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { Button } from "~/components/commons/Button";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import PageTitle from "~/components/commons/PageTitle";
import RunnerCard from "./_components/RunnerCard";
import useRunnersPagination from "./_hooks/useRunnersPagination";

function CMSRunnersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);

  const {
    data: runnersPagination,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useRunnersPagination({
    page_size: 12,
    search: debouncedSearch,
    sort_by: "name",
    sort_order: "asc",
  });

  const isNoData =
    runnersPagination.pages.every((page) => page.data.length === 0) &&
    !isFetching;

  const isSearchNoData = search.length > 0 && isNoData;

  const router = useRouter();

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <>
      <PageTitle>Runners</PageTitle>
      <div className="@container flex flex-col h-full px-4">
        <div className="flex justify-end items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search runners..."
          />
          <Button
            onClick={() => router.push("/cms/runners/new")}
            className="my-4 shrink-0 px-3 py-1.5"
          >
            <Plus size="1rem" />
            New runner
          </Button>
        </div>
        <Error
          isError={isError && !isFetching}
          fallback={
            <ErrorFallback
              icon={<ServerCrash size="2rem" />}
              onRetry={refetch}
              title="Cannot get the runners"
              message="There was an error getting the runners. Please try again later or report the issue."
            />
          }
        >
          {isNoData || isSearchNoData ? (
            <NoDataAvailable />
          ) : (
            <>
              <div className="mt-4 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-max">
                {runnersPagination.pages.map((page) =>
                  page.data.map((runner) => (
                    <RunnerCard key={runner.id} runner={runner} />
                  )),
                )}
                <Loading
                  isLoading={isFetching}
                  fallback={Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} className="h-32" />
                  ))}
                />
              </div>
              <div ref={bottomDivRef} className="h-20" />
            </>
          )}
        </Error>
      </div>
    </>
  );
}

export default CMSRunnersPage;
