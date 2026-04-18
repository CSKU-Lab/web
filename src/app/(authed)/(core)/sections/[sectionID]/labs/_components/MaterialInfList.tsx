"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useInputDebounce from "~/hooks/useInputDebounce";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import useResolvePath from "~/hooks/useResolvePath";
import { cn } from "~/lib/utils";
import useCoreLab from "../_hooks/useCoreLab";
import MaterialListItemSkeleton from "./MaterialListItemSkeleton";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import { ServerCrash, FileText } from "lucide-react";

const studentStatusConfig = {
  passed: "from-green-500 to-green-500/40",
  not_passed: "from-red-500 to-red-500/40",
  in_progress: "from-yellow-500 to-yellow-500/40",
  not_started: "from-gray-400 to-gray-400/40",
};

function MaterialInfList() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);

  const { useGetInfMaterial } = useCoreLab();
  const {
    data: materialPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = useGetInfMaterial({
    page_size: 12,
    sort_by: "created_at",
    sort_order: "desc",
    filters: [],
    search: debouncedSearch,
  });

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  const isNoData =
    materialPagination.pages.every((page) => page.data.length === 0) &&
    !isFetching;

  return (
    <div className="flex flex-col flex-1">
      <Error
        isError={isError && !isFetching}
        fallback={
          <ErrorFallback
            icon={<ServerCrash size="2rem" />}
            onRetry={refetch}
            title="Cannot get the materials"
            message="There was an error to get the materials. Please try again later or report issue"
          />
        }
      >
        {isNoData ? (
          <NoDataAvailable />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {materialPagination.pages.map((page) =>
              page.data.map((material) => {
                const { id, name, student_status, type } = material;
                return (
                  <MaterialItem
                    key={id}
                    id={id}
                    name={name}
                    student_status={student_status}
                    type={type}
                  />
                );
              }),
            )}

            {isFetching &&
              Array.from({ length: 8 }).map((_, index) => (
                <MaterialListItemSkeleton key={`skeleton-${index}`} />
              ))}

            <div ref={bottomDivRef} className="h-20" />
          </div>
        )}
      </Error>
    </div>
  );
}

interface MaterialItemProps {
  id: string;
  name: string;
  student_status?: "passed" | "not_passed" | "in_progress" | "not_started";
  type: string;
}

export const MaterialItem = ({
  id,
  name,
  student_status = "not_started",
  type,
}: MaterialItemProps) => {
  const router = useRouter();
  const generatePath = useResolvePath();
  const handleMaterialRoute = (id: string) => {
    router.push(generatePath(`/sections/:sectionID/labs/:slug/materials/${id}`));
  };

  const config = studentStatusConfig[student_status];

  return (
    <div
      className="rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2) cursor-pointer transition-colors duration-200 flex flex-col"
      onClick={() => handleMaterialRoute(id)}
    >
      <div className={cn("h-5 bg-gradient-to-br", config)} />
      <div className="p-4 flex flex-col gap-2 justify-between flex-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-(--gray-11)">
            <FileText className="w-3 h-3" />
            <span className="text-xs">{type}</span>
          </div>
          <h3 className="text-lg font-medium line-clamp-2">{name}</h3>
        </div>
      </div>
    </div>
  );
};

export default MaterialInfList;
