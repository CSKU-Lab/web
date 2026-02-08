import { useAtom } from "jotai";
import SubmissionList from "./SubmissionList";
import { submissionAtom } from "~/globalStore/submissions";
import SubmissionDetail from "./SubmissionDetail";
import useMaterialSubmissionPagination from "../../[materialID]/_hooks/useMaterialSubmisionPagination";
import type { CodeSubmissionResult } from "~/types/core-submission";

function SumissionsTab() {
  const [{ selectedSubmissionId }] = useAtom(submissionAtom);
  const { data } = useMaterialSubmissionPagination<CodeSubmissionResult>({});
  console.log(data);

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
