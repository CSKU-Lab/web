"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";
import {
  CMSLabStatusMaterial,
  CMSLabStatusSubmission,
} from "~/types/cms-lab-status";

interface StatusCellProps {
  material: CMSLabStatusMaterial;
  submission: CMSLabStatusSubmission;
  materialIndex: number;
  hoveredMaterialIndex: number | null;
  onHover: (index: number | null) => void;
  baseUrl: string;
  studentId: string;
}

const statusColors: Record<CMSLabStatusSubmission["status"], string> = {
  passed: "bg-(--grass-9)",
  failed: "bg-(--tomato-9)",
  not_submitted: "bg-(--gray-4)",
};

const formatFullDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function StatusCell({
  material,
  submission,
  materialIndex,
  hoveredMaterialIndex,
  onHover,
  baseUrl,
  studentId,
}: StatusCellProps) {
  const isHighlighted = hoveredMaterialIndex === materialIndex;

  const cellContent = (
    <Link
      href={`${baseUrl}/materials/${material.material_id}/submissions?student_id=${studentId}`}
      className="block"
    >
      <div
        className={`size-5 rounded-sm ${statusColors[submission.status]} transition-all duration-150 ${
          isHighlighted
            ? "ring-2 ring-(--accent-accent) ring-offset-1 ring-offset-background scale-110"
            : ""
        }`}
        onMouseEnter={() => onHover(materialIndex)}
        onMouseLeave={() => onHover(null)}
      />
    </Link>
  );

  const statusText =
    submission.status === "not_submitted"
      ? "Not Submitted"
      : submission.status === "passed"
        ? "Passed"
        : "Failed";
  const tooltipContent = (
    <div className="text-center">
      <div className="font-medium">{material.material_name}</div>
      <div className="text-(--gray-10)">
        {statusText}
        {submission.submitted_at &&
          ` - ${formatFullDateTime(submission.submitted_at)}`}
      </div>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
