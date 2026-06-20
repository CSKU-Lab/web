"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ServerCrash, Code2, FileText, Keyboard } from "lucide-react";
import useInputDebounce from "~/hooks/useInputDebounce";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import useResolvePath from "~/hooks/useResolvePath";
import { cn } from "~/lib/utils";
import useCoreLab from "~/features/core/sections/hooks/labs/useCoreLab";
import { useIsLabReadonly } from "~/features/core/sections/hooks/labs/useIsLabReadonly";
import MaterialListItemSkeleton from "~/features/core/sections/components/labs/MaterialListItemSkeleton";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";

const studentStatusConfig = {
  passed: {
    gradient: "from-green-500 to-green-500/40",
    dot: "bg-green-500",
    label: "Passed",
  },
  not_passed: {
    gradient: "from-red-500 to-red-500/40",
    dot: "bg-red-500",
    label: "Not passed",
  },
  in_progress: {
    gradient: "from-yellow-500 to-yellow-500/40",
    dot: "bg-yellow-500",
    label: "In progress",
  },
  not_started: {
    gradient: "from-gray-400 to-gray-400/40",
    dot: "bg-gray-400",
    label: "Not started",
  },
};

const typeConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  code: { icon: <Code2 className="w-3 h-3" />, label: "Code" },
  typing: { icon: <Keyboard className="w-3 h-3" />, label: "Typing" },
  document: { icon: <FileText className="w-3 h-3" />, label: "Document" },
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
    sort_by: "position",
    sort_order: "asc",
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
  isReadonly?: boolean;
  labSlug?: string;
}

export const MaterialItem = ({
  id,
  name,
  student_status = "not_started",
  type,
  isReadonly: isReadonlyProp,
  labSlug,
}: MaterialItemProps) => {
  const router = useRouter();
  const generatePath = useResolvePath();
  const isReadonlyFromHook = useIsLabReadonly();
  const isReadonly = isReadonlyProp ?? isReadonlyFromHook;

  const handleMaterialRoute = (id: string) => {
    const labSegment = labSlug ?? ":slug";
    router.push(generatePath(`/sections/:sectionID/labs/${labSegment}/materials/${id}`));
  };

  const statusCfg = studentStatusConfig[student_status];
  const typeCfg = typeConfig[type] ?? { icon: <FileText className="w-3 h-3" />, label: type };

  return (
    <div
      className={cn(
        "rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2) cursor-pointer transition-colors duration-200 flex flex-col",
        isReadonly && "border-(--blue-6)",
      )}
      onClick={() => handleMaterialRoute(id)}
    >
      <div
        className={cn(
          "h-5 bg-gradient-to-br",
          isReadonly ? "from-blue-400 to-blue-300" : statusCfg.gradient,
        )}
      />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-(--gray-10)">
            {typeCfg.icon}
            <span className="text-xs">{typeCfg.label}</span>
          </div>
          {isReadonly && (
            <span className="inline-flex items-center gap-1 text-xs text-(--blue-11) bg-(--blue-3) px-1.5 py-0.5 rounded shrink-0">
              <Lock size={10} />
              Readonly
            </span>
          )}
        </div>

        <h3 className="text-base font-medium line-clamp-2 flex-1">{name}</h3>

        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full shrink-0", statusCfg.dot)} />
          <span className="text-xs text-(--gray-11)">{statusCfg.label}</span>
        </div>
      </div>
    </div>
  );
};

export default MaterialInfList;
