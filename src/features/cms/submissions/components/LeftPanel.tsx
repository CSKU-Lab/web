import StudentList from "~/features/cms/submissions/components/StudentList";
import StudentAllSubmissions from "~/features/cms/submissions/components/StudentAllSubmissions";
import { useSearchParams } from "next/navigation";

function LeftPanel() {
  const searchParams = useSearchParams();
  const isViewAllStudentSubmissions = searchParams.get("student_id") !== null;

  if (isViewAllStudentSubmissions) {
    return <StudentAllSubmissions />;
  }

  return <StudentList />;
}

export default LeftPanel;
