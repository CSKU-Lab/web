import UserProfileImage from "~/components/Menus/UserProfileImage";
import { cn } from "~/lib/utils";
import StatusBadge from "~/features/cms/submissions/components/StatusBadge";
import { Button } from "~/components/commons/Button";
import { useRouter } from "next/navigation";
import { CMSSectionStudentLatestSubmission } from "~/types/cms-section-submission";

interface StudentCardProps {
  studentSubmission: CMSSectionStudentLatestSubmission;
  isSelected?: boolean;
  onClick?: () => void;
}

function StudentCard({
  studentSubmission,
  isSelected,
  onClick,
}: StudentCardProps) {
  const { student, auto_score, manual_score, ip, status } = studentSubmission;

  const router = useRouter();
  const handleViewAllSubmissions = () => {
    router.push(window.location.pathname + `?student_id=${student.id}`);
  };

  return (
    <div
      data-student-id={student.id}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-(--gray-3) cursor-pointer",
        "hover:bg-(--gray-2)",
        isSelected && "bg-(--gray-3) border-l-2 border-l-accent",
      )}
    >
      <UserProfileImage
        username={student.username}
        src={student.profile_image}
        size="2.25rem"
        className="self-start"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h6 className="text-sm font-medium text-(--gray-12) truncate">
            {student.display_name}
          </h6>
          <StatusBadge status={status} />
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-(--gray-11) truncate">
            @{student.username}
          </span>
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
        {isSelected && (
          <Button onClick={handleViewAllSubmissions} className="h-6 mt-2">
            View all submissions
          </Button>
        )}
      </div>
    </div>
  );
}

export default StudentCard;
