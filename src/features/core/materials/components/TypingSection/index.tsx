"use client";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TypingMaterialPayload } from "~/types/typing-material";
import type { TypingSubmissionPayload } from "~/types/typing-submission";
import { coreSubmissionService } from "~/services/core-submission.service";
import { queryKeys } from "~/queryKeys";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import { useIsLabReadonly } from "~/features/core/sections/hooks/labs/useIsLabReadonly";
import { useTypingSession } from "~/features/core/materials/hooks/typing-section/useTypingSession";
import TypingTest from "~/features/core/materials/components/TypingSection/TypingTest";

export default function TypingSection() {
  const isReadonly = useIsLabReadonly();
  const { data: material, isLoading: isMaterialLoading } =
    useGetCoreMaterial<TypingMaterialPayload>();
  const text = material?.payload.content ?? "";

  const { sectionID, slug: labID, materialID } = useParams<{
    sectionID: string;
    slug: string;
    materialID: string;
  }>();

  const queryClient = useQueryClient();

  // Manage typing session (start session and get token)
  const {
    token,
    isLoading: isSessionLoading,
    error: sessionError,
    resetSession,
  } = useTypingSession({
    materialID,
    labID,
    sectionID,
    enabled: !isMaterialLoading && !!text,
  });

  // Submission mutation
  const submitMutation = useMutation({
    mutationFn: (typedText: string) => {
      if (!token) {
        throw new Error("No active typing session");
      }
      const payload: TypingSubmissionPayload = {
        token,
        typed_text: typedText,
      };
      return coreSubmissionService.create<TypingSubmissionPayload>({
        material_id: materialID,
        lab_id: labID,
        section_id: sectionID,
        payload,
      });
    },
    onSuccess: () => {
      toast.success("Typing submission successful!");
      // Refresh submissions list
      queryClient.invalidateQueries({
        queryKey: queryKeys.core.material.getPagination(materialID),
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit typing results"
      );
    },
  });

  const handleTypingComplete = (typedText: string) => {
    if (token) {
      submitMutation.mutate(typedText);
    }
  };

  const handleRetry = () => {
    submitMutation.reset();
    resetSession();
  };

  if (isMaterialLoading || isSessionLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-(--gray-10) text-sm">Loading...</span>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <span className="text-(--gray-10) text-sm">
          Failed to start typing session
        </span>
        <button
          onClick={resetSession}
          className="px-4 py-2 bg-(--gray-3) hover:bg-(--gray-4) rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isReadonly) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <span className="text-(--blue-11) font-medium text-sm">Readonly</span>
        <span className="text-(--gray-10) text-xs">Submissions are closed for this lab</span>
      </div>
    );
  }

  return (
    <TypingTest
      text={text}
      onComplete={handleTypingComplete}
      onRetry={handleRetry}
      isSubmitting={submitMutation.isPending}
      submitError={submitMutation.error as Error | null}
      isSubmitted={submitMutation.isSuccess}
    />
  );
}
