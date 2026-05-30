"use client";

import { useRouter } from "next/navigation";
import { Calendar, GripVertical, Hash, Star, User } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { CMSLab } from "~/types/cms-lab";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import DefaultSwitch from "~/features/cms/courses/components/labs/DefaultSwitch";

dayjs.extend(relativeTime);

interface LabCardProps {
  lab: CMSLab;
  courseID: string;
  isDefault?: boolean;
  isOrderable?: boolean;
  onToggle?: (labId: string, isDefault: boolean) => void;
}

function LabCard({
  lab,
  courseID,
  isDefault = false,
  isOrderable = false,
  onToggle,
}: LabCardProps) {
  const router = useRouter();
  const { id, display_name, created_by, created_at } = lab;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isOrderable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCardClick = () => {
    router.push(`/cms/courses/${courseID}/labs/${id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "z-50 opacity-80")}
    >
      {isOrderable && (
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
      )}
      <div
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        className={cn(
          "block rounded-md overflow-hidden",
          "bg-(--gray-1) border border-(--gray-4)",
          "hover:bg-(--gray-2) hover:border-(--gray-5)",
          "transition-colors duration-150",
          "cursor-pointer",
          isDefault && "border-blue-500 dark:border-blue-400",
          isDragging && "shadow-lg",
        )}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-(--gray-9) mb-1">
                <Hash size={12} />
                <span className="font-medium">Name</span>
              </div>
              <h3 className="text-lg font-medium line-clamp-2">{display_name}</h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isDefault && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1",
                    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
                  )}
                >
                  <Star size={12} />
                  Default
                </span>
              )}
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
                  "bg-(--gray-3) text-(--gray-11)",
                  isDefault && "hidden",
                )}
              >
                Lab
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-(--gray-10)">
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span className="truncate max-w-[100px]">{created_by}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{dayjs(created_at).fromNow()}</span>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <DefaultSwitch
                        courseID={courseID}
                        isDefault={isDefault}
                        data={{ lab_id: id }}
                        onToggle={onToggle}
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set as default lab for students</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabCard;