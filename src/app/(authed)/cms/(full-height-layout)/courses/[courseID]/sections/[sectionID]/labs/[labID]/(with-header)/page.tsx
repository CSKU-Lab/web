"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ServerCrash } from "lucide-react";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { Skeleton } from "~/components/ui/skeleton";
import Loading from "~/components/commons/Loading";
import MaterialCard from "../_components/MaterialCard";
import { useMaterialPagination } from "../_hooks/useMaterialPagination";

function Page() {
  const { courseID, sectionID, labID } = useParams<{
    courseID: string;
    sectionID: string;
    labID: string;
  }>();
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);

  const {
    data: materialPages,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = useMaterialPagination({
    sectionID,
    labID,
    params: {
      page_size: 12,
    },
  });

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage && !isFetching,
  });

  const allMaterials = materialPages?.pages.flatMap((page) => page.data) ?? [];
  const filteredMaterials = debouncedSearch
    ? allMaterials.filter((m) =>
        m.material_data.name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      )
    : allMaterials;

  const isNoData = allMaterials.length === 0 && !isFetching;
  const isSearchNoData = search.length > 0 && isNoData;

  return (
    <>
      <div className="@container flex flex-col h-full px-4">
        <div className="flex justify-end items-center gap-2 my-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search materials..."
          />
        </div>

        <Error
          isError={isError && !isFetching}
          fallback={
            <ErrorFallback
              icon={<ServerCrash size="2rem" />}
              onRetry={refetch}
              title="Cannot get the materials"
              message="There was an error getting the materials. Please try again later or report the issue."
            />
          }
        >
          {isNoData || isSearchNoData ? (
            <NoDataAvailable />
          ) : (
            <>
              <div className="mt-4 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-max">
                {filteredMaterials.map((labMaterial) => (
                  <MaterialCard
                    key={labMaterial.id}
                    material={labMaterial.material_data}
                    courseID={courseID}
                    sectionID={sectionID}
                    labID={labID}
                  />
                ))}
                <Loading
                  isLoading={isFetching}
                  fallback={Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-52 rounded-md" />
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

export default Page;
