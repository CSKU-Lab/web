import { useAtom } from "jotai";
import SubmissionList from "./SubmissionList";
import { submissionAtom } from "~/globalStore/submissions";
import SubmissionDetail from "./SubmissionDetail";

function SumissionsTab() {
  const [{ selectedSubmissionId }] = useAtom(submissionAtom);

  return (
    <div className="p-4">
      {selectedSubmissionId !== null ? (
        <SubmissionDetail />
      ) : (
        <SubmissionList />
      )}
    </div>
  );
}

export default SumissionsTab;
