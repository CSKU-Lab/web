"use client";

import { useEffect, type ReactNode } from "react";
import { useSetAtom } from "jotai";
import { useSubmissionStatusListener } from "~/features/core/materials/hooks/useSubmissionStatusListener";
import { submissionAtom } from "~/globalStore/submissions";
import {
  submissionFilesAtom,
  submissionTemplateFilesAtom,
  selectedRunnerAtom,
  submissionStatusAtom,
  activeSubmissionsAtom,
  activeLeftTabAtom,
} from "~/features/core/materials/stores/submission.store";

interface MaterialPageClientProps {
  materialID: string;
  children: ReactNode;
}

export default function MaterialPageClient({
  materialID,
  children,
}: MaterialPageClientProps) {
  const setSubmissionFiles = useSetAtom(submissionFilesAtom);
  const setSubmissionTemplateFiles = useSetAtom(submissionTemplateFilesAtom);
  const setSelectedRunner = useSetAtom(selectedRunnerAtom);
  const setSubmissionStatus = useSetAtom(submissionStatusAtom);
  const setActiveSubmissions = useSetAtom(activeSubmissionsAtom);
  const setActiveLeftTab = useSetAtom(activeLeftTabAtom);
  const setSubmission = useSetAtom(submissionAtom);

  // Reset all material-specific state when materialID changes
  useEffect(() => {
    setSubmissionFiles([]);
    setSubmissionTemplateFiles([]);
    setSelectedRunner(null);
    setSubmissionStatus("NO_SUBMISSION");
    setActiveSubmissions(new Set());
    setActiveLeftTab("description");
    // Clear the selected submission — it's a global atom keyed by submission id,
    // so without this the detail view keeps showing the previous material's
    // submission after switching materials.
    setSubmission({ selectedSubmissionId: null });
  }, [
    materialID,
    setSubmissionFiles,
    setSubmissionTemplateFiles,
    setSelectedRunner,
    setSubmissionStatus,
    setActiveSubmissions,
    setActiveLeftTab,
    setSubmission,
  ]);

  // Hook manages all EventSource connections
  useSubmissionStatusListener(materialID);

  // Just render children
  return <>{children}</>;
}
