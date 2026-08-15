import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { cmsSubmissionService } from "~/services/cms-submission.service";
import { queryKeys } from "~/queryKeys";
import { selectedSubmissionAtom } from "~/features/cms/submissions/stores/selected-submission.store";
import type { CMSSectionSubmission } from "~/types/cms-section-submission";

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
  const selectedSubmission = useAtomValue(selectedSubmissionAtom);
  const setSelectedSubmission = useSetAtom(selectedSubmissionAtom);
  const submissionsKey = queryKeys.section.submissions(
    sectionId,
    labId,
    materialId,
  );

  const updateCachedData = (
    data: unknown,
    submissionID: string,
    score: number,
  ): unknown => {
    if (Array.isArray(data)) {
      return data.map((submission: CMSSectionSubmission) =>
        submission.id === submissionID
          ? { ...submission, manual_score: score }
          : submission,
      );
    }

    if (
      data &&
      typeof data === "object" &&
      "pages" in data &&
      Array.isArray(data.pages)
    ) {
      return {
        ...data,
        pages: data.pages.map((page: unknown) =>
          updateCachedData(page, submissionID, score),
        ),
      };
    }

    return data;
  };

  return useMutation({
    mutationFn: ({ submissionID, score }: UpdateManualScoreParams) =>
      cmsSubmissionService.updateManualScore(submissionID, score),
    onMutate: async ({ submissionID, score }) => {
      await queryClient.cancelQueries({ queryKey: submissionsKey });

      const cachedSubmissions = queryClient.getQueriesData({
        queryKey: submissionsKey,
      });

      cachedSubmissions.forEach(([queryKey, data]) => {
        queryClient.setQueryData(
          queryKey,
          updateCachedData(data, submissionID, score),
        );
      });

      const previousSelectedSubmission = selectedSubmission;
      if (previousSelectedSubmission?.id === submissionID) {
        setSelectedSubmission({
          ...previousSelectedSubmission,
          manual_score: score,
        });
      }

      return { cachedSubmissions, previousSelectedSubmission };
    },
    onError: (_error, _variables, context) => {
      context?.cachedSubmissions.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousSelectedSubmission) {
        setSelectedSubmission(context.previousSelectedSubmission);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: submissionsKey,
      });
    },
  });
}
