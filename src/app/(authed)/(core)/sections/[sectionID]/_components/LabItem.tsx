"use client";

import { useRouter } from "next/navigation";
import useResolvePath from "~/hooks/useResolvePath";
import { CircleCheck, CircleX, CirclePlay } from "lucide-react";
import { dateFormatter } from "~/lib/formatters/dateFormatter";

interface LabItemProps {
  id: string;
  name: string;
  openedAt?: string | Date;
  closedAt?: string | Date;
  status?: string;
}

type StatusKey = "passed" | "not_passed" | "in_progress";

const statusColorMap: Record<StatusKey, React.ReactNode> = {
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

export const LabItem = ({ id, name, openedAt, closedAt, status }: LabItemProps) => {
  const router = useRouter();
  const generatePath = useResolvePath();
  const handleCourseItemClick = (id: string) => {
    router.push(generatePath(`/sections/:sectionID/labs/${id}`));
  };

  const currentStatus = (status as StatusKey) || "in_progress";

  return (
    <div
      className="rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2) cursor-pointer transition-colors duration-200"
      onClick={() => handleCourseItemClick(id)}
    >
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-medium line-clamp-2">{name}</h3>
        <div className="flex flex-col text-xs text-(--gray-11)">
          <p>Posted: {openedAt ? dateFormatter(openedAt) : "N/A"}</p>
          <p>Due date: {closedAt ? dateFormatter(closedAt) : "N/A"}</p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-(--gray-11)">Status:</span>
          {statusColorMap[currentStatus]}
        </div>
      </div>
    </div>
  );
};
