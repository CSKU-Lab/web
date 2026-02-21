import StudentList from "./StudentList";
import StudentAllSubmissions from "./StudentAllSubmissions";
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
