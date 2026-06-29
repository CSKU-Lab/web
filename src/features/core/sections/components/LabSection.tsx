"use client";

import { Lock } from "lucide-react";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { cn } from "~/lib/utils";
import useLabMaterials from "~/features/core/sections/hooks/useLabMaterials";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { MaterialItem } from "~/features/core/sections/components/labs/MaterialInfList";
import MaterialListItemSkeleton from "~/features/core/sections/components/labs/MaterialListItemSkeleton";

interface LabSectionProps {
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
    accent: "bg-green-500",
    progressBar: "bg-green-500",
  },
  not_passed: {
    accent: "bg-red-500",
    progressBar: "bg-red-500",
  },
  in_progress: {
    accent: "bg-yellow-500",
    progressBar: "bg-yellow-500",
  },
  not_started: {
    accent: "bg-gray-400",
    progressBar: "bg-gray-400",
  },
};

export function LabSection({
  id,
  name,
  sectionID,
  readonlyAt,
  status = "disabled",
  studentStatus = "in_progress",
  totalMaterials,
  completedMaterials,
}: LabSectionProps) {
  const isDisabled = status === "disabled";
  const isReadonly = status === "readonly";
  const config = studentStatusConfig[studentStatus];

  const {
    data: materialsData,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useLabMaterials(id, sectionID, !isDisabled);

  const bottomRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage && !isDisabled,
  });

  const progressPercent =
    totalMaterials && totalMaterials > 0
      ? Math.round((completedMaterials || 0) * (100 / totalMaterials))
      : 0;

  const allMaterials = materialsData?.pages.flatMap((p) => p.data) ?? [];

  return (
    <section
      className={cn(
        "flex flex-col gap-4",
        isDisabled && "opacity-60",
      )}
    >
      {/* Lab header */}
      <div className="flex flex-col gap-2 border-b border-(--gray-4) pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "w-1.5 h-5 rounded-full shrink-0",
                isReadonly ? "bg-(--blue-9)" : config.accent,
              )}
            />
            <h3 className="text-xl font-semibold line-clamp-1">{name}</h3>
          </div>
          {isReadonly && (
            <span className="inline-flex items-center gap-1 text-xs text-(--blue-11) bg-(--blue-3) px-1.5 py-0.5 rounded shrink-0">
              <Lock size={10} />
              Readonly
            </span>
          )}
        </div>

        {readonlyAt && (
          <p className="text-xs text-(--gray-11) pl-3.5">
            Due: {dateFormatter(readonlyAt)}
          </p>
        )}

        {totalMaterials !== undefined && (
          <div className="flex flex-col gap-1 pl-3.5 max-w-sm">
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

      {/* Materials */}
      {isDisabled ? (
        <p className="text-xs text-(--gray-10) py-1 pl-3.5">
          This lab is not available yet
        </p>
      ) : allMaterials.length === 0 && !isFetching ? (
        <p className="text-xs text-(--gray-10) py-1 pl-3.5">No materials</p>
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
          <div ref={bottomRef} />
        </div>
      )}
    </section>
  );
}
