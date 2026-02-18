import { cn } from "~/lib/utils";
import type { SubmissionStatus } from "~/types/cms-section-submission";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  passed: {
    label: "Passed",
    className: "bg-(--grass-3) text-(--grass-11) border-(--grass-6)",
  },
  failed: {
    label: "Failed",
    className: "bg-(--tomato-3) text-(--tomato-11) border-(--tomato-6)",
  },
  queued: {
    label: "Queued",
    className: "bg-(--gray-3) text-(--gray-11) border-(--gray-6)",
  },
  running: {
    label: "Running",
    className: "bg-(--amber-3) text-(--amber-11) border-(--amber-6)",
  },
  not_submitted: {
    label: "Not Submitted",
    className: "bg-(--gray-2) text-(--gray-9) border-(--gray-5)",
  },
};

interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;
