import { useAtom } from "jotai";
import SubmissionList from "~/features/core/materials/components/SubmissionsTab/SubmissionList";
import { submissionAtom } from "~/globalStore/submissions";
import SubmissionDetail from "~/features/core/materials/components/SubmissionsTab/SubmissionDetail";
import useMaterialSubmissionPagination from "~/features/core/materials/hooks/useMaterialSubmisionPagination";
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
