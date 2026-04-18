"use client";
import MaterialInfList from "../_components/MaterialInfList";
import useCoreLab from "../_hooks/useCoreLab";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const studentStatusConfig = {
  passed: "bg-green-500",
  not_passed: "bg-red-500",
  in_progress: "bg-yellow-500",
  not_started: "bg-gray-400",
};

export default function LabPage() {
  const { useGetLabSection } = useCoreLab();
  const { data: labSection, isLoading: isLsLoading } = useGetLabSection();

  const status = labSection?.student_status || "not_started";
  const statusColor = studentStatusConfig[status];
  const statusLabel = status.replace("_", " ");

  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <div className="px-4 lg:px-12 py-4">
        <div className="flex items-center gap-4">
          <div className={cn("w-2 h-12 rounded-full", statusColor)} />
          <div className="flex flex-col">
            {isLsLoading ? (
              <>
                <Skeleton className="w-48 h-6" />
                <Skeleton className="w-24 h-4 mt-1" />
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-(--gray-12)">
                  {labSection?.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-(--gray-11) capitalize">
                    {statusLabel}
                  </span>
                  {labSection?.closed_at && (
                    <span className="text-xs text-(--gray-11)">
                      • Due: {dateFormatter(labSection.closed_at)}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-12 pb-4 flex flex-col flex-1">
        <div>
          <h4 className="font-semibold text-2xl">Materials</h4>
        </div>
        <div className="mt-4">
          <MaterialInfList />
        </div>
      </div>
    </div>
  );
}
