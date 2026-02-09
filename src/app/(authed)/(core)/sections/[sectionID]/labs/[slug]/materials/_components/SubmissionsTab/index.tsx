import { useAtom } from "jotai";
import SubmissionList from "./SubmissionList";
import { submissionAtom } from "~/globalStore/submissions";
import SubmissionDetail from "./SubmissionDetail";
import useMaterialSubmissionPagination from "../../[materialID]/_hooks/useMaterialSubmisionPagination";
import type { CodeSubmissionOverview } from "~/types/core-code-submission";

function SumissionsTab() {
  const [{ selectedSubmissionId }] = useAtom(submissionAtom);
  useMaterialSubmissionPagination<CodeSubmissionOverview>({});

  return (
    <div className="p-4 h-full">
      {selectedSubmissionId !== null ? (
        <SubmissionDetail />
      ) : (
        <SubmissionList />
      )}
    </div>
  );
}

export default SumissionsTab;
