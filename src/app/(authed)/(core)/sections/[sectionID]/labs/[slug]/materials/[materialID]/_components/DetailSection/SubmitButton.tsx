"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Loader2, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { coreSubmissionService } from "~/services/core-submission.service";
import { queryKeys } from "~/queryKeys";
import {
  submissionFilesAtom,
  selectedRunnerAtom,
  submissionStatusAtom,
  activeSubmissionsAtom,
} from "../../_stores/submission.store";
import type { CodeSubmissionPayload } from "~/types/core-code-submission";
import useGetCoreMaterial from "../../_hooks/useGetCoreMaterial";
import { MaterialType } from "~/types/core-material";

interface SubmitButtonProps {
  sectionID: string;
  labID: string;
  materialID: string;
}

function SubmitButton({ sectionID, labID, materialID }: SubmitButtonProps) {
  const { data: material } = useGetCoreMaterial();
  const files = useAtomValue(submissionFilesAtom);
  const selectedRunner = useAtomValue(selectedRunnerAtom);
  const setSubmissionStatus = useSetAtom(submissionStatusAtom);
  const setActiveSubmissions = useSetAtom(activeSubmissionsAtom);
  const queryClient = useQueryClient();

  if (material?.type === MaterialType.TYPE) {
    return null;
  }

  const submitMutation = useMutation({
    mutationFn: () => {
      return coreSubmissionService.create<CodeSubmissionPayload>({
        material_id: materialID,
        lab_id: labID,
        section_id: sectionID,
        payload: {
          files,
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

      // 3. Refetch submissions to show the new submission
      queryClient.invalidateQueries({
        queryKey: queryKeys.core.material.getPagination(materialID),
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

  return (
    <Button
      onClick={handleSubmit}
      disabled={submitMutation.isPending || !selectedRunner?.id}
      className="bg-(--amber-9) hover:bg-(--amber-10) text-white"
    >
      {submitMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Submit
        </>
      )}
    </Button>
  );
}

export default SubmitButton;
