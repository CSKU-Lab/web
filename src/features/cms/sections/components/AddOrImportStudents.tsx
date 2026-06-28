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
import { useState } from "react";
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
  const [importKey, setImportKey] = useState(0);

  const { sectionID } = useParams<{ sectionID: string }>();
  const queryClient = useQueryClient();
  const addStudent = useMutation({
    mutationFn: (studentUsernames: string[]) =>
      cmsSectionService.addStudents(sectionID, studentUsernames),
    onSuccess: (res, submittedUsernames) => {
      const notFound = res.data.not_found ?? [];
      const notStudents = res.data.not_students ?? [];
      const alreadyAdded = res.data.already_added ?? [];
      const addedCount =
        submittedUsernames.length -
        notFound.length -
        notStudents.length -
        alreadyAdded.length;

      if (addedCount > 0) {
        toast.success(`${addedCount} student(s) added successfully`);
      }
      if (notFound.length > 0) {
        toast.error("Some usernames were not found and were skipped", {
          description: notFound.join(", "),
        });
      }
      if (notStudents.length > 0) {
        toast.error("Some users are not students and were skipped", {
          description: notStudents.join(", "),
        });
      }
      if (alreadyAdded.length > 0) {
        toast.warning("Some students are already in the section", {
          description: alreadyAdded.join(", "),
        });
      }

      // Keep the skipped-but-fixable usernames (not found / not a student) in
      // the import list so the user can see and fix them; drop the rest.
      setImportStudents([...notFound, ...notStudents]);
      setAutoCompleteStudents([]);
      // Remount StudentImport so its editor reflects the remaining usernames.
      setImportKey((key) => key + 1);
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
            key={importKey}
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
