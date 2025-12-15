import { useAtom } from "jotai";
import { useState } from "react";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";
import type { Student } from "~/types/cms-section";
import { selectedStudentAtom } from "../../_stores/student-management.store";
import DeleteButton from "./DeleteButton";

interface Props {
  student: Student;
}

function StudentBlock({ student }: Props) {
  const { id, username, display_name, profile_image } = student;
  const [selectedStudents, toggleSelect] = useAtom(selectedStudentAtom);
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const isSelected = selectedStudents.some((student) => student.id === id);
  const showCheckbox = isHover || isSelected;

  const handleCheckChange = () => {
    toggleSelect(student);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "border shadow-xs shadow-gray-50 rounded-lg space-y-2 relative bg-white hover:bg-(--gray-2) transition-colors",
        isSelected && "border-accent bg-(--gray-2)",
      )}
    >
      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckChange}
          className="absolute left-2 top-2"
        />
      )}
      <div className="p-6 pt-4 pb-0 space-y-2">
        <div className="flex justify-center">
          <UserProfileImage
            username={username}
            src={profile_image}
            size="3rem"
          />
        </div>
        <div>
          <h5 className="font-medium text-sx text-(--gray-12) text-center truncate">
            {display_name}
          </h5>
          <h6 className="text-xs text-(--gray-11) text-center truncate">
            @{username}
          </h6>
        </div>
      </div>
      <DeleteButton student={student} />
    </div>
  );
}

export default StudentBlock;
