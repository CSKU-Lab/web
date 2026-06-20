"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { TypingMaterialPayload } from "~/types/typing-material";
import type { TypingSubmissionPayload, Keystroke } from "~/types/typing-submission";
import type { TypingSubmissionOverview } from "~/features/core/materials/components/TypingSection/types";
import { coreSubmissionService } from "~/services/core-submission.service";
import { coreMaterialService } from "~/services/core-material.service";
import { queryKeys } from "~/queryKeys";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import { useIsLabReadonly } from "~/features/core/sections/hooks/labs/useIsLabReadonly";
import { useTypingSession } from "~/features/core/materials/hooks/typing-section/useTypingSession";
import TypingTest from "~/features/core/materials/components/TypingSection/TypingTest";
import TypingSubmissionsList from "~/features/core/materials/components/TypingSection/TypingSubmissionsList";

type View = "typing" | "submissions";

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
  const [view, setView] = useState<View>("typing");
  const [serverResults, setServerResults] = useState<TypingSubmissionOverview | null>(null);
  const markStartedPromiseRef = useRef<Promise<string> | null>(null);

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

  const submitMutation = useMutation({
    mutationFn: async (keystrokes: Keystroke[]) => {
      const activeToken = markStartedPromiseRef.current
        ? await markStartedPromiseRef.current
        : token;
      if (!activeToken) throw new Error("No active typing session");
      const payload: TypingSubmissionPayload = {
        token: activeToken,
        keystrokes,
      };
      const res = await coreSubmissionService.create<TypingSubmissionPayload>({
        material_id: materialID,
        lab_id: labID,
        section_id: sectionID,
        payload,
      });
      const submission = await coreSubmissionService.getByID<TypingSubmissionOverview>(res.data.id);
      return submission;
    },
    onSuccess: (submission) => {
      setServerResults(submission.payload as TypingSubmissionOverview);
      queryClient.invalidateQueries({
        queryKey: queryKeys.core.material.getPagination(materialID),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.core.material.getBestTypingSubmission(materialID, labID, sectionID),
      });
    },
  });

  const handleRetry = () => {
    submitMutation.reset();
    resetSession();
    setServerResults(null);
    markStartedPromiseRef.current = null;
    setView("typing");
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
        <span className="text-(--gray-10) text-sm">Failed to start typing session</span>
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
    <div className="flex-1 relative overflow-hidden min-h-0">
      <AnimatePresence mode="wait" initial={false}>
        {view === "typing" ? (
          <motion.div
            key="typing"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col"
          >
            <TypingTest
              text={text}
              onStarted={() => {
                if (token) {
                  markStartedPromiseRef.current = coreMaterialService
                    .markTypingStarted(materialID, token)
                    .then((r) => r.token);
                }
              }}
              onComplete={(keystrokes) => submitMutation.mutate(keystrokes)}
              onResults={() => {}}
              onRetry={handleRetry}
              onViewSubmissions={() => setView("submissions")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="submissions"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <TypingSubmissionsList
              onBack={() => setView("typing")}
              results={serverResults}
              isSubmitting={submitMutation.isPending}
              submitError={submitMutation.error as Error | null}
              onRetry={handleRetry}
              materialAutoScore={material?.auto_score ?? 0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
