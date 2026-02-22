"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ServerCrash, ArrowLeft } from "lucide-react";
import Link from "next/link";
import RouteNavigation from "../../_components/RouteNavigation";
import PageTitle from "~/components/commons/PageTitle";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { Skeleton } from "~/components/ui/skeleton";
import Loading from "~/components/commons/Loading";
import MaterialCard from "./_components/MaterialCard";
import { useMaterialPagination } from "./_hooks/useMaterialPagination";
import { useGetSectionLab } from "./_hooks/useGetSectionLab";
import { cn } from "~/lib/utils";
import type { LabStatus } from "~/types/cms-section-lab";

interface PageParams {
  [key: string]: string;
  courseID: string;
  sectionID: string;
  labID: string;
}

const statusConfig: Record<LabStatus, { text: string; colorClass: string }> = {
  open: { text: "Open", colorClass: "text-(--grass-9)" },
  readonly: { text: "Readonly", colorClass: "text-(--blue-9)" },
  hidden: { text: "Hidden", colorClass: "text-(--gray-9)" },
  disabled: { text: "Disabled", colorClass: "text-(--amber-9)" },
  closed: { text: "Closed", colorClass: "text-(--red-9)" },
};

function Page() {
  const { courseID, sectionID, labID } = useParams<PageParams>();
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);

  const { data: lab, isLoading: isLabLoading } = useGetSectionLab({
    sectionID,
    labID,
  });

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

  const statusStyle = lab ? statusConfig[lab.status] : null;

  const labMenus = [
    {
      name: "Materials",
      href: `/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}`,
    },
    {
      name: "Settings",
      href: `/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}/settings`,
    },
  ];

  return (
    <>
      <RouteNavigation
        headerContent={
          <>
            <Link
              href={`/cms/courses/${courseID}/sections/${sectionID}/labs`}
              className="inline-flex items-center gap-2 text-sm text-(--gray-11) hover:text-(--gray-12) mb-2 transition-colors ml-4 my-2.5"
            >
              <ArrowLeft size={16} />
              <span>Back to Labs</span>
            </Link>
            <PageTitle>{lab?.lab_name ?? "Loading..."}</PageTitle>
            {!isLabLoading && lab && (
              <div className="flex items-center gap-3 ml-4 mt-1 text-sm text-(--gray-11)">
                <span className={cn("font-medium", statusStyle?.colorClass)}>
                  {statusStyle?.text}
                </span>
                <span>•</span>
                <span>
                  {lab.completed_students}/{lab.total_students} students
                  completed
                </span>
              </div>
            )}
          </>
        }
        menus={labMenus}
      />

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
