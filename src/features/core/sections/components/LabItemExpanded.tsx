"use client";

import { useState, useRef } from "react";
import { Lock, ChevronDown } from "lucide-react";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { cn } from "~/lib/utils";
import useLabMaterials from "~/features/core/sections/hooks/useLabMaterials";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { MaterialItem } from "~/app/(authed)/(core)/sections/[sectionID]/labs/_components/MaterialInfList";
import MaterialListItemSkeleton from "~/app/(authed)/(core)/sections/[sectionID]/labs/_components/MaterialListItemSkeleton";

interface LabItemExpandedProps {
  id: string;
  name: string;
  sectionID: string;
  readonlyAt?: string | Date;
  status?: "open" | "readonly" | "disabled";
  studentStatus?: "passed" | "not_passed" | "in_progress" | "not_started";
  totalMaterials?: number;
  completedMaterials?: number;
}

const studentStatusConfig = {
  passed: {
    gradient: "from-green-500 to-green-500/40",
    progressBar: "bg-green-500",
  },
  not_passed: {
    gradient: "from-red-500 to-red-500/40",
    progressBar: "bg-red-500",
  },
  in_progress: {
    gradient: "from-yellow-500 to-yellow-500/40",
    progressBar: "bg-yellow-500",
  },
  not_started: {
    gradient: "from-gray-400 to-gray-400/40",
    progressBar: "bg-gray-400",
  },
};

export function LabItemExpanded({
  id,
  name,
  sectionID,
  readonlyAt,
  status = "disabled",
  studentStatus = "in_progress",
  totalMaterials,
  completedMaterials,
}: LabItemExpandedProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: materialsData,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useLabMaterials(id, sectionID, isOpen);

  const bottomRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage && isOpen,
  });

  const isDisabled = status === "disabled";
  const isReadonly = status === "readonly";
  const config = studentStatusConfig[studentStatus];

  const progressPercent =
    totalMaterials && totalMaterials > 0
      ? Math.round((completedMaterials || 0) * (100 / totalMaterials))
      : 0;

  const allMaterials = materialsData?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div
      className={cn(
        "rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) flex flex-col",
        isReadonly && "border-(--blue-6)",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-col transition-colors duration-200",
          !isDisabled && "cursor-pointer hover:bg-(--gray-2)",
          isDisabled && "opacity-60 cursor-not-allowed",
        )}
        onClick={() => !isDisabled && setIsOpen((o) => !o)}
      >
        <div
          className={cn(
            "h-2 bg-gradient-to-br",
            isReadonly ? "from-blue-400 to-blue-300" : config.gradient,
          )}
        />
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {!isDisabled && (
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-(--gray-10) transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              )}
              <h3 className="text-lg font-medium line-clamp-1">{name}</h3>
            </div>
            {isReadonly && (
              <span className="inline-flex items-center gap-1 text-xs text-(--blue-11) bg-(--blue-3) px-1.5 py-0.5 rounded shrink-0">
                <Lock size={10} />
                Readonly
              </span>
            )}
          </div>

          {readonlyAt && (
            <p className="text-xs text-(--gray-11) pl-6">
              Due: {dateFormatter(readonlyAt)}
            </p>
          )}

          {totalMaterials !== undefined && (
            <div className="flex flex-col gap-1 pl-6">
              <div className="flex justify-between text-xs">
                <span className="text-(--gray-11)">Materials</span>
                <span className="font-medium text-(--gray-12)">
                  {completedMaterials || 0}/{totalMaterials}
                </span>
              </div>
              <div className="h-1.5 bg-(--gray-3) rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    config.progressBar,
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Materials panel */}
      {isOpen && !isDisabled && (
        <div className="border-t border-(--gray-4) px-4 py-4 flex flex-col gap-3">
          {allMaterials.length === 0 && !isFetching ? (
            <p className="text-xs text-(--gray-10) py-1">No materials</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {allMaterials.map((material) => (
                <MaterialItem
                  key={material.id}
                  id={material.id}
                  name={material.name}
                  student_status={material.student_status}
                  type={material.type}
                  isReadonly={isReadonly}
                  labSlug={id}
                />
              ))}
              {isFetching &&
                Array.from({ length: 4 }).map((_, i) => (
                  <MaterialListItemSkeleton key={i} />
                ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
