"use client";
import { Fragment, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useInputDebounce from "~/hooks/useInputDebounce";
import type { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import Filters from "~/components/commons/Filters";
import SearchInput from "~/components/commons/SearchInput";
import useLabMaterialInfPagination from "../_hooks/useLabMaterialInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { Badge } from "~/components/ui/badge";
import { MaterialType } from "~/types/cms-material";
import { useMaterialDisplay } from "~/hooks/useMaterialDisplay";
import useResolvePath from "~/hooks/useResolvePath";

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

  const { slug } = useParams();

  const {
    data: materialPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useLabMaterialInfPagination({
    labID: "019b56b9-19d5-73b5-a9f1-96f36c59957f",
    payload: {
      page_size: 5,
      sort_by: "created_at",
      sort_order: "desc",
      filters: [],
      search: debouncedSearch,
    },
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
      <div className="grid grid-cols-4 gap-4 w-full text-sm py-3 px-4 font-bold mt-6 border-b mb-3">
        <p>Name</p>
        <p>Tag</p>
        <p>Type</p>
        <p>Visibility</p>
      </div>
      <div className="flex flex-col divide-y divide-(--gray-3)">
        {materialPagination.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.data.map(({ material_data }) => {
              const { id, name, tags, type, visibility } = material_data;

              return (
                <MaterialListItem
                  key={id}
                  id={id}
                  name={name}
                  tags={tags}
                  type={type as MaterialType}
                  visibility={visibility}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
      <div ref={bottomDivRef} className="h-20"></div>
    </div>
  );
}

interface MaterialListItemProps {
  id: string;
  name: string;
  tags: string[];
  type: MaterialType;
  visibility: "public" | "private";
}

const MaterialListItem = ({
  id,
  name,
  tags,
  type,
  visibility,
}: MaterialListItemProps) => {
  const { logoMap, visibilityStyleMap } = useMaterialDisplay();
  const router = useRouter();
  const generatePath = useResolvePath();
  const handleMaterialRoute = (id: string) => {
    router.push(
      generatePath(`/sections/:sectionID/labs/:slug/materials/${id}`),
    );
  };

  return (
    <button
      onClick={() => handleMaterialRoute(id)}
      key={id}
      className="
        grid grid-cols-4 gap-4
        w-full px-4 py-3 text-sm items-center
        hover:underline transition-colors
        cursor-pointer
        odd:bg-(--gray-2)
      "
    >
      <p className="font-medium truncate w-fit">{name}</p>

      <div className="flex gap-1 items-center overflow-hidden">
        {tags.slice(0, 1).map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}

        {tags.length > 1 && <Badge variant="outline">+{tags.length - 1}</Badge>}
      </div>

      <div className="flex items-center gap-2">
        {logoMap[type as MaterialType]}
        <p className="text-(--gray-11) capitalize">{type}</p>
      </div>

      <Badge
        variant="outline"
        className={visibilityStyleMap[visibility].className}
      >
        {visibility}
      </Badge>
    </button>
  );
};

export default MaterialInfList;
