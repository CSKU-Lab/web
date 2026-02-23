"use client";

import Link from "next/link";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CMSSectionLab, LabStatus } from "~/types/cms-section-lab";
import { cn } from "~/lib/utils";

const statusConfig: Record<
  LabStatus,
  { gradient: string; label: string; textColor: string }
> = {
  open: {
    gradient: "from-green-500 to-green-300",
    label: "Open",
    textColor: "text-green-700",
  },
  readonly: {
    gradient: "from-blue-500 to-blue-300",
    label: "Readonly",
    textColor: "text-blue-700",
  },
  hidden: {
    gradient: "from-gray-400 to-gray-300",
    label: "Hidden",
    textColor: "text-gray-500",
  },
  disabled: {
    gradient: "from-amber-500 to-amber-300",
    label: "Disabled",
    textColor: "text-amber-700",
  },
  closed: {
    gradient: "from-red-500 to-red-300",
    label: "Closed",
    textColor: "text-red-700",
  },
};

interface LabCardProps {
  lab: CMSSectionLab;
  courseID: string;
  sectionID: string;
}

function LabCard({ lab, courseID, sectionID }: LabCardProps) {
  const { lab_id, lab_name, position, status } = lab;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lab_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = statusConfig[status];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "z-50 opacity-80")}
    >
      {/* Drag handle - slides out from the left on hover */}
      <button
        type="button"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -left-3 z-10",
          "flex items-center justify-center w-6 h-10 rounded-md",
          "bg-(--gray-1) border border-(--gray-4) shadow-sm",
          "text-(--gray-8) hover:text-(--gray-12) hover:bg-(--gray-2)",
          "cursor-grab active:cursor-grabbing touch-none",
          "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
          "transition-all duration-150 ease-out",
          "focus:outline-none focus:opacity-100 focus:translate-x-0",
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>

      <Link
        href={`/cms/courses/${courseID}/sections/${sectionID}/labs/${lab_id}`}
        className={cn(
          "block rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2)",
          isDragging && "shadow-lg",
        )}
      >
        <div className={cn("h-5 bg-linear-to-bl", config.gradient)} />
        <div className="p-4 space-y-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h6 className="text-xs text-(--gray-9) leading-tight">Name</h6>
              <h3 className="text-lg font-medium line-clamp-2 mt-1">
                {lab_name}
              </h3>
            </div>
            <span className="text-xs font-medium text-(--gray-9) bg-(--gray-3) rounded-full px-2 py-0.5 shrink-0">
              #{position}
            </span>
          </div>
          <div>
            <h6 className="text-xs text-(--gray-9) leading-tight">Status</h6>
            <span
              className={cn("text-sm font-medium mt-1", config.textColor)}
            >
              {config.label}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default LabCard;
