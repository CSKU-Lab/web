import { CMSSectionSubmission } from "~/types/cms-section-submission";
import StatusBadge from "./StatusBadge";
import { cn } from "~/lib/utils";

interface Props {
  submission: CMSSectionSubmission;
  isSelected?: boolean;
  onClick?: () => void;
}

function SubmissionCard({ submission, isSelected, onClick }: Props) {
  const { id, order, status, auto_score, manual_score, ip, created_at } =
    submission;

  return (
    <button
      data-submission-id={id}
      onClick={onClick}
      className={cn(
        "p-2 hover:bg-(--gray-2) w-full",
        isSelected && "bg-(--gray-3) border-l-2 border-l-accent",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-sm font-medium text-(--gray-12) truncate">
          Submission #{order}
        </h6>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-xs text-(--gray-11) truncate">{created_at}</span>
        <span className="text-xs text-(--gray-8)">|</span>
        <span className="text-xs text-(--gray-11)">
          {auto_score}/{manual_score}
        </span>
        {ip && (
          <>
            <span className="text-xs text-(--gray-8)">|</span>
            <span className="text-xs text-(--gray-9) font-mono">{ip}</span>
          </>
        )}
      </div>
    </button>
  );
}

export default SubmissionCard;
