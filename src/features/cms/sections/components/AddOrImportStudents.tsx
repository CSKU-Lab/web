import { UserRoundPlus } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import UserAutoComplete, {
  type UserData,
} from "~/components/commons/UserAutoComplete";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsSectionService } from "~/services/cms-section.service";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryKeys } from "~/queryKeys";
import StudentImport from "~/features/cms/sections/components/StudentImport";

function AddOrImportStudents() {
  const [importedStudents, setImportStudents] = useState<string[]>([]);
  const [autoCompleteStudents, setAutoCompleteStudents] = useState<UserData[]>(
    [],
  );
  const clearRef = useRef(false);

  const { sectionID } = useParams<{ sectionID: string }>();
  const queryClient = useQueryClient();
  const addStudent = useMutation({
    mutationFn: (studentUsernames: string[]) =>
      cmsSectionService.addStudents(sectionID, studentUsernames),
    onSuccess: () => {
      toast.success("Students added successfully");
      setImportStudents([]);
      setAutoCompleteStudents([]);
      clearRef.current = true;
      queryClient.invalidateQueries({
        queryKey: queryKeys.section.getStudents(sectionID),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", { description: err.response?.data.error });
      }
    },
  });

  const handleAddStudents = () => {
    const studentsToAddByUsername = importedStudents;
    const studentsToAddByAutoComplete = autoCompleteStudents.map(
      (student) => student.username,
    );

    const allStudentsToAdd = [
      ...studentsToAddByAutoComplete,
      ...studentsToAddByUsername,
    ];

    addStudent.mutate(allStudentsToAdd);
    clearRef.current = false;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <UserRoundPlus size="1rem" />
          Add or Import
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add or Import Students</SheetTitle>
          <SheetDescription>
            You can add or import students using csv file here
          </SheetDescription>
        </SheetHeader>

        <div className="p-4 py-0 space-y-4">
          <UserAutoComplete
            placeHolder="Type student name"
            value={autoCompleteStudents}
            onChange={setAutoCompleteStudents}
          />

          <div className="flex items-center gap-2">
            <h6 className="text-sm text-(--gray-11)">or import by username</h6>
          </div>
          <StudentImport
            // eslint-disable-next-line react-hooks/refs
            key={clearRef.current ? "clear" : "no-clear"}
            value={importedStudents}
            onChange={setImportStudents}
          />

          <Button onClick={handleAddStudents} variant="action">
            Add Students
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AddOrImportStudents;
