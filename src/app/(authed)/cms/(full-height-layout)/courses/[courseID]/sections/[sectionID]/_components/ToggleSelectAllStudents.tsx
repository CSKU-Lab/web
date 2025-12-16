import { useAtom } from "jotai";
import { Checkbox } from "~/components/ui/checkbox";
import { toggleSelectAllStudentsAtom } from "../_stores/student-management.store";
import { Button } from "~/components/commons/Button";
import type { Student } from "~/types/cms-section";

interface Props {
  students: Student[];
}

function ToggleSelectAllStudents({ students }: Props) {
  const [selectedStudents, toggleStudents] = useAtom(
    toggleSelectAllStudentsAtom,
  );

  const allSelected =
    selectedStudents.length === students.length && students.length > 0;

  const someSelected =
    selectedStudents.length > 0 && selectedStudents.length < students.length;

  if (selectedStudents.length === 0) {
    return null;
  }

  const handleToggle = () => {
    toggleStudents(students);
  };

  return (
    <Button
      onClick={handleToggle}
      className="flex items-center gap-1.5 px-2 py-1"
      variant="transparent"
    >
      <Checkbox
        checked={someSelected ? "indeterminate" : allSelected}
        asChild
      />
      <span className="text-xs">
        {allSelected ? "Deselect All" : "Select All"}
      </span>
    </Button>
  );
}

export default ToggleSelectAllStudents;
