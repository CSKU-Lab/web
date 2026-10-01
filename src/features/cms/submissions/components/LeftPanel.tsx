import StudentList from "~/features/cms/submissions/components/StudentList";
import StudentAllSubmissions from "~/features/cms/submissions/components/StudentAllSubmissions";
import { useSearchParams } from "next/navigation";

function LeftPanel({ isTyping = false }: { isTyping?: boolean }) {
  const searchParams = useSearchParams();
  const isViewAllStudentSubmissions = searchParams.get("student_id") !== null;

  if (isViewAllStudentSubmissions) {
    return <StudentAllSubmissions isTyping={isTyping} />;
  }

  return <StudentList isTyping={isTyping} />;
}

export default LeftPanel;
