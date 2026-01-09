import { useAtom } from "jotai";
import SubmissionList from "./SubmissionList";
import { submissionAtom } from "~/globalStore/submissions";
import SubmissionDetail from "./SubmissionDetail";

function SumissionsTab() {
  const [{ selectedSubmissionId }] = useAtom(submissionAtom);
  if (selectedSubmissionId === null) {
    return <SubmissionList />;
  }

  return <SubmissionDetail />;
}

export default SumissionsTab;
