import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsSubmissionService } from "~/services/cms-submission.service";
import { queryKeys } from "~/queryKeys";

interface UpdateManualScoreParams {
  submissionID: string;
  score: number;
}

interface UseUpdateManualScoreOptions {
  sectionId: string;
  labId: string;
  materialId: string;
}

export function useUpdateManualScore({
  sectionId,
  labId,
  materialId,
}: UseUpdateManualScoreOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionID, score }: UpdateManualScoreParams) =>
      cmsSubmissionService.updateManualScore(submissionID, score),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.section.submissions(sectionId, labId, materialId),
      });
    },
  });
}
