"use client";
import PageTitle from "~/components/commons/PageTitle";
import { MaterialPieChart } from "../_components/MaterialPieChart";
import MaterialInfList from "../_components/MaterialInfList";
import useCoreLab from "../_hooks/useCoreLab";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { Skeleton } from "~/components/ui/skeleton";
import { useState } from "react";
import useInputDebounce from "~/hooks/useInputDebounce";
import { useSearchParams } from "next/navigation";
import { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";

export default function LabPage() {
  const { useGetLabSection, useGetInfMaterial } = useCoreLab();
  const { data: labSection, isLoading: isLsLoading } = useGetLabSection();

  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);

  const filterFields = [
    { display: "Name", value: "name" },
    { display: "Type", value: "type" },
  ];

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IFilter[]>(() =>
    searchParamsToFilter(searchParams, filterFields),
  );

  const {
    data: materialPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
    totalRows,
  } = useGetInfMaterial({
    page_size: 5,
    sort_by: "created_at",
    sort_order: "desc",
    filters: [],
    search: debouncedSearch,
  });

  const totalSubmitted =
    materialPagination?.pages
      .flatMap((page) => page.data)
      .filter((item) => item.material_data.auto_score !== 0).length ?? 0;

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-4 min-h-[100vh] h-full gap-6">
      <div className="flex flex-col h-fit shadow-md rounded-lg p-6 gap-6 ">
        <div className="flex flex-col gap-6 items-center h-full w-full">
          <div className="flex flex-col text-xl gap-4 w-full">
            <div className="flex flex-col gap-3">
              {isLsLoading ? (
                <>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </>
              ) : (
                <>
                  <h2 className="font-bold">{labSection?.lab_name}</h2>
                  <p className="text-xs">
                    Posted:{" "}
                    {labSection?.opened_at
                      ? dateFormatter(labSection.opened_at)
                      : "N/A"}
                  </p>
                  <p className="text-xs">
                    Due date:{" "}
                    {labSection?.closed_at
                      ? dateFormatter(labSection.closed_at)
                      : "N/A"}
                  </p>
                </>
              )}
            </div>
          </div>

          <hr className="w-full" />

          <div className="aspect-square h-full my-6 max-h-[15rem] w-full flex items-center justify-center">
            {isLsLoading ? (
              <Skeleton className="h-full rounded-full aspect-square" />
            ) : (
              <MaterialPieChart
                totalMaterials={totalRows || 0}
                completedMaterials={totalSubmitted || 0}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full flex-1 lg:col-span-3">
        <PageTitle>Materials</PageTitle>

        <div className="flex flex-col h-full flex-1 gap-4">
          <MaterialInfList />
        </div>
      </div>
    </div>
  );
}
