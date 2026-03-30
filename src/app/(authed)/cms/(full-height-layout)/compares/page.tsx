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
import CompareCard from "./_components/CompareCard";
import useComparesPagination from "./_hooks/useComparesPagination";

function CMSComparesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);

  const {
    data: comparesPagination,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useComparesPagination({
    page_size: 12,
    search: debouncedSearch,
    sort_by: "name",
    sort_order: "asc",
  });

  const isNoData =
    comparesPagination.pages.every((page) => page.data.length === 0) &&
    !isFetching;

  const isSearchNoData = search.length > 0 && isNoData;

  const router = useRouter();

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <>
      <PageTitle>Compares</PageTitle>
      <div className="@container flex flex-col h-full px-4">
        <div className="flex justify-end items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search compares..."
          />
          <Button
            onClick={() => router.push("/cms/compares/new")}
            className="my-4 shrink-0 px-3 py-1.5"
          >
            <Plus size="1rem" />
            New compare
          </Button>
        </div>
        <Error
          isError={isError && !isFetching}
          fallback={
            <ErrorFallback
              icon={<ServerCrash size="2rem" />}
              onRetry={refetch}
              title="Cannot get the compares"
              message="There was an error getting the compares. Please try again later or report the issue."
            />
          }
        >
          {isNoData || isSearchNoData ? (
            <NoDataAvailable />
          ) : (
            <>
              <div className="mt-4 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-max">
                {comparesPagination.pages.map((page) =>
                  page.data.map((compare) => (
                    <CompareCard key={compare.id} compare={compare} />
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

export default CMSComparesPage;
