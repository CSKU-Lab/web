import { useQuery } from "@tanstack/react-query";
import { coreSubmissionService } from "~/services/core-submission.service";
import { queryKeys } from "~/queryKeys";
import type { CodeSubmissionDetail } from "~/types/core-code-submission";

function useSubmissionDetail(submissionID: string | null) {
  return useQuery({
    queryKey: queryKeys.core.material.getSubmissionDetail(submissionID ?? ""),
    queryFn: () =>
      coreSubmissionService.getByID<CodeSubmissionDetail>(submissionID!),
    enabled: !!submissionID,
  });
}

export default useSubmissionDetail;
