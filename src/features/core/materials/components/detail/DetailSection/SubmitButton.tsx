"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { CloudUpload, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { coreSubmissionService } from "~/services/core-submission.service";
import { queryKeys } from "~/queryKeys";
import {
  submissionFilesAtom,
  submissionTemplateFilesAtom,
  selectedRunnerAtom,
  submissionStatusAtom,
  activeSubmissionsAtom,
  activeLeftTabAtom,
} from "~/features/core/materials/stores/submission.store";
import type { CodeSubmissionPayload } from "~/types/core-code-submission";
import { buildSubmittedFiles } from "~/components/Editor/utils/segments";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import { useIsLabReadonly } from "~/features/core/sections/hooks/labs/useIsLabReadonly";
import { MaterialType } from "~/types/core-material";

interface SubmitButtonProps {
  sectionID: string;
  labID: string;
  materialID: string;
}

function SubmitButton({ sectionID, labID, materialID }: SubmitButtonProps) {
  const { data: material } = useGetCoreMaterial();
  const isReadonly = useIsLabReadonly();
  const files = useAtomValue(submissionFilesAtom);
  const templateFiles = useAtomValue(submissionTemplateFilesAtom);
  const selectedRunner = useAtomValue(selectedRunnerAtom);
  const setSubmissionStatus = useSetAtom(submissionStatusAtom);
  const setActiveSubmissions = useSetAtom(activeSubmissionsAtom);
  const setActiveLeftTab = useSetAtom(activeLeftTabAtom);
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: () => {
      return coreSubmissionService.create<CodeSubmissionPayload>({
        material_id: materialID,
        lab_id: labID,
        section_id: sectionID,
        payload: {
          files: buildSubmittedFiles(templateFiles, files),
          runner_id: selectedRunner?.id ?? "",
        },
      });
    },
    onSuccess: (response) => {
      const newSubmissionId = response.data.id;

      toast.success("Submission created successfully");

      // 1. Set status to GRADING immediately
      setSubmissionStatus("GRADING");

      // 2. Add to activeSubmissionsAtom so hook creates EventSource
      setActiveSubmissions((prev) => {
        const next = new Set(prev);
        next.add(newSubmissionId);
        return next;
      });

      // 3. Switch to submissions tab immediately
      setActiveLeftTab("submissions");

      // 4. Refetch submissions to show the new submission
      queryClient.invalidateQueries({
        queryKey: queryKeys.core.material.getPagination(materialID),
      });

      // 5. Invalidate sidebar so material status dot reflects in-progress
      queryClient.invalidateQueries({
        queryKey: queryKeys.sidebar.get(),
      });
    },
    onError: () => {
      toast.error("Failed to create submission");
    },
  });

  const handleSubmit = () => {
    if (!selectedRunner?.id) {
      toast.error("Please select a runner first");
      return;
    }
    submitMutation.mutate();
  };

  if (material?.type === MaterialType.TYPE || isReadonly) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSubmit}
      disabled={submitMutation.isPending || !selectedRunner?.id}
    >
      {submitMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <CloudUpload className="mr-2 h-3 w-3" />
          Submit
        </>
      )}
    </Button>
  );
}

export default SubmitButton;
