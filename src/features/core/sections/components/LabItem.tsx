"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import useResolvePath from "~/hooks/useResolvePath";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { cn } from "~/lib/utils";

interface LabItemProps {
  id: string;
  name: string;
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

export const LabItem = ({
  id,
  name,
  readonlyAt,
  status = "disabled",
  studentStatus = "in_progress",
  totalMaterials,
  completedMaterials,
}: LabItemProps) => {
  const router = useRouter();
  const generatePath = useResolvePath();
  const handleCourseItemClick = (labId: string) => {
    if (status === "disabled") return;
    router.push(generatePath(`/sections/:sectionID/labs/${labId}`));
  };

  const progressPercent =
    totalMaterials && totalMaterials > 0
      ? Math.round((completedMaterials || 0) * (100 / totalMaterials))
      : 0;

  const isDisabled = status === "disabled";
  const isReadonly = status === "readonly";
  const config = studentStatusConfig[studentStatus];

  return (
    <div
      className={cn(
        "rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) transition-colors duration-200 flex flex-col",
        !isDisabled && "hover:bg-(--gray-2) cursor-pointer",
        isDisabled && "opacity-60 cursor-not-allowed",
        isReadonly && "border-(--blue-6)",
      )}
      onClick={() => handleCourseItemClick(id)}
    >
      <div className={cn("h-5 bg-gradient-to-br", isReadonly ? "from-blue-400 to-blue-300" : config.gradient)} />
      <div className="p-4 flex flex-col gap-2 justify-between flex-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-medium line-clamp-2">{name}</h3>
            {isReadonly && (
              <span className="inline-flex items-center gap-1 text-xs text-(--blue-11) bg-(--blue-3) px-1.5 py-0.5 rounded shrink-0">
                <Lock size={10} />
                Readonly
              </span>
            )}
          </div>
          {readonlyAt && (
            <div className="text-xs text-(--gray-11)">
              <p>Due: {dateFormatter(readonlyAt)}</p>
            </div>
          )}
        </div>
        {totalMaterials !== undefined && (
          <div className="flex flex-col gap-1">
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
  );
};
