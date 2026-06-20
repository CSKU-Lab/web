import { CMSSectionSubmission } from "~/types/cms-section-submission";
import StatusBadge from "~/features/cms/submissions/components/StatusBadge";
import { cn } from "~/lib/utils";
import { Trash2 } from "lucide-react";

interface Props {
  submission: CMSSectionSubmission;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: (submission: CMSSectionSubmission) => void;
}

function SubmissionCard({ submission, isSelected, onClick, onDelete }: Props) {
  const { id, order, status, auto_score, manual_score, ip, created_at } =
    submission;

  return (
    <div
      data-submission-id={id}
      className={cn(
        "p-2 hover:bg-(--gray-2) w-full group/card relative",
        isSelected && "bg-(--gray-3) border-l-2 border-l-accent",
      )}
    >
      <button className="w-full text-left" onClick={onClick}>
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

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(submission);
          }}
          className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-(--red-3) hover:text-(--red-9) text-(--gray-9)"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export default SubmissionCard;
