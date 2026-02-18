import { useAtom } from "jotai";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { cn } from "~/lib/utils";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";
import { selectedStudentIdAtom } from "../_stores/selected-student.store";
import StatusBadge from "./StatusBadge";

interface StudentCardProps {
  studentSubmission: CMSSectionStudentSubmission;
}

function StudentCard({ studentSubmission }: StudentCardProps) {
  const { student, auto_score, manual_score, ip, submission_status } =
    studentSubmission;
  const [selectedId, setSelectedId] = useAtom(selectedStudentIdAtom);

  const isSelected = selectedId === student.id;

  return (
    <button
      data-student-id={student.id}
      onClick={() => setSelectedId(student.id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-(--gray-3)",
        "hover:bg-(--gray-2)",
        isSelected && "bg-(--gray-3) border-l-2 border-l-accent",
      )}
    >
      <UserProfileImage
        username={student.username}
        src={student.profile_image}
        size="2.25rem"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h6 className="text-sm font-medium text-(--gray-12) truncate">
            {student.display_name}
          </h6>
          <StatusBadge status={submission_status} />
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
      </div>
    </button>
  );
}

export default StudentCard;
