"use client";

import { Fragment, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useInputDebounce from "~/hooks/useInputDebounce";
import type { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import Filters from "~/components/commons/Filters";
import SearchInput from "~/components/commons/SearchInput";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { useMaterialDisplay } from "~/hooks/useMaterialDisplay";
import useResolvePath from "~/hooks/useResolvePath";
import { CircleCheck, CirclePlay, CircleX } from "lucide-react";
import useCoreLab from "../_hooks/useCoreLab";
import { LabMaterial } from "~/types/core-lab-material";
import { Material } from "~/types/core-material";
import MaterialListItemSkeleton from "./MaterialListItemSkeleton";

function MaterialInfList() {
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

  const { useGetInfMaterial } = useCoreLab();
  const {
    data: materialPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useGetInfMaterial({
    page_size: 5,
    sort_by: "created_at",
    sort_order: "desc",
    filters: [],
    search: debouncedSearch,
  });

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex justify-end items-center gap-2 my-4">
        <SearchInput
          placeholder="Search labs..."
          className="w-full md:w-fit"
          value={search}
          onChange={setSearch}
        />
      </div>
      <div className="flex justify-end ">
        <Filters
          value={filters}
          onChange={setFilters}
          className="mt-2"
          fields={filterFields}
        />
      </div>
      <div className="grid grid-cols-10 gap-4 w-full text-sm py-3 px-4 font-bold mt-6 border-b mb-3">
        <span></span>
        <p className="col-span-9">Name</p>
      </div>
      <div className="flex flex-col divide-y divide-(--gray-3)">
        {isFetching && materialPagination.pages.length === 0 ? (
          <div className="flex flex-col divide-y divide-(--gray-3)">
            {Array.from({ length: 10 }).map((_, index) => (
              <MaterialListItemSkeleton key={index} />
            ))}
          </div>
        ) : (
          materialPagination.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.data.map((material) => {
                const { id, material_id, material_data } = material;

                return (
                  <MaterialListItem
                    key={id}
                    id={material_id}
                    data={material_data}
                  />
                );
              })}
            </Fragment>
          ))
        )}
      </div>
      <div ref={bottomDivRef} className="h-20"></div>
    </div>
  );
}

interface MaterialListItemProps {
  id: string;
  data: Material;
}

const MaterialListItem = ({ id, data }: MaterialListItemProps) => {
  const router = useRouter();
  const generatePath = useResolvePath();
  const handleMaterialRoute = (id: string) => {
    router.push(
      generatePath(`/sections/:sectionID/labs/:slug/materials/${id}`),
    );
  };
  const statusColorMap = {
    passed: (
      <div className="text-green-500 flex items-center gap-2">
        <CircleCheck />
      </div>
    ),
    not_passed: (
      <div className="text-red-500 flex items-center gap-2">
        <CircleX />
      </div>
    ),
    in_progress: (
      <div className="text-yellow-500 flex items-center gap-2">
        <CirclePlay />
      </div>
    ),
  };

  return (
    <button
      onClick={() => handleMaterialRoute(id)}
      key={id}
      className="
        grid grid-cols-10 gap-4
        w-full px-4 py-3 text-sm items-center
        hover:underline transition-colors
        cursor-pointer
        odd:bg-(--gray-2)
      "
    >
      {statusColorMap["not_passed"]}
      <p className="font-medium truncate w-fit col-span-9">{data.name}</p>
    </button>
  );
};

export default MaterialInfList;
