"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CloudUpload, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import CodeEditor from "~/components/Editor/CodeEditor";
import { Button } from "~/components/ui/button";
import { coreMaterialService } from "~/services/core-material.service";
import { coreSubmissionService } from "~/services/core-submission.service";
import type { CoreCodeMaterial } from "~/types/core-code-material";
import type { Runner } from "~/components/Editor/types/runner";
import type { CodeFile } from "~/components/Editor/types/editor";
import type { CodeSubmissionPayload } from "~/types/core-code-submission";
import type { MaterialDetail } from "~/types/core-material";

interface Props {
  materialID: string;
  sectionID: string;
  labID: string;
}

type SubmissionStatus = "idle" | "grading" | "passed" | "failed";

export function InlineCodeEditor({ materialID, sectionID, labID }: Props) {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [score, setScore] = useState<number | null>(null);

  const { data: material, isLoading } = useQuery<MaterialDetail<CoreCodeMaterial>>({
    queryKey: ["inline-code-material", materialID, sectionID, labID],
    queryFn: () => coreMaterialService.getById<CoreCodeMaterial>(materialID, sectionID, labID),
    enabled: !!materialID && !!sectionID && !!labID,
  });

  const allowedRunners = useMemo(
    () =>
      material?.payload.allowed_runners.map((r) => ({
        id: r.id,
        name: r.name,
        initial_files: r.files,
      })) ?? [],
    [material],
  );

  const resourceFileNames = useMemo(
    () => new Set((material?.payload.resource_files ?? []).map((f) => f.name)),
    [material],
  );

  const resourceFiles = useMemo(
    () => (material?.payload.resource_files ?? []).map((f) => ({ ...f, readonly: true })),
    [material],
  );

  const editorFiles = useMemo(() => [...files, ...resourceFiles], [files, resourceFiles]);

  useEffect(() => {
    if (!material || selectedRunner !== null || allowedRunners.length === 0) return;
    const first = allowedRunners[0];
    setSelectedRunner(first);
    setFiles(first.initial_files);
  }, [material, selectedRunner, allowedRunners]);

  const handleRunnerChange = useCallback((runner: Runner) => {
    setSelectedRunner(runner);
    setFiles(runner.initial_files);
  }, []);

  const handleFilesChange = useCallback(
    (newFiles: typeof editorFiles) => {
      setFiles(newFiles.filter((f) => !resourceFileNames.has(f.name)));
    },
    [resourceFileNames],
  );

  const listenForResult = useCallback(
    async (submissionId: string) => {
      try {
        const es = await coreSubmissionService.listenByID(submissionId);
        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.status === "passed" || data.status === "failed") {
              setStatus(data.status === "passed" ? "passed" : "failed");
              if (typeof data.auto_score === "number") {
                setScore(data.auto_score);
              }
              es.close();
              queryClient.invalidateQueries({
                queryKey: ["inline-code-material", materialID, sectionID, labID],
              });
            }
          } catch {
            // ignore parse errors
          }
        };
        es.onerror = () => {
          setStatus("failed");
          es.close();
        };
      } catch {
        setStatus("failed");
      }
    },
    [materialID, sectionID, labID, queryClient],
  );

  const submitMutation = useMutation({
    mutationFn: () =>
      coreSubmissionService.create<CodeSubmissionPayload>({
        material_id: materialID,
        section_id: sectionID,
        lab_id: labID,
        payload: {
          files,
          runner_id: selectedRunner?.id ?? "",
        },
      }),
    onSuccess: (response) => {
      setStatus("grading");
      setScore(null);
      toast.success("Submitted successfully");
      listenForResult(response.data.id);
    },
    onError: () => {
      toast.error("Submission failed");
    },
  });

  const handleSubmit = () => {
    if (!selectedRunner?.id) {
      toast.error("Please select a runner first");
      return;
    }
    submitMutation.mutate();
  };

  const renderStatus = () => {
    if (status === "grading") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-(--yellow-11)">
          <Loader2 size="0.75rem" className="animate-spin" />
          <span>Grading...</span>
        </div>
      );
    }
    if (status === "passed") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-(--grass-11)">
          <CheckCircle2 size="0.75rem" />
          <span>Passed{score !== null ? ` · ${score} pts` : ""}</span>
        </div>
      );
    }
    if (status === "failed") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-(--tomato-11)">
          <XCircle size="0.75rem" />
          <span>Failed{score !== null ? ` · ${score} pts` : ""}</span>
        </div>
      );
    }
    return null;
  };

  const maxScore = material?.auto_score ?? 0;

  return (
    <div className="border rounded-lg my-4 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-(--gray-2) border-b shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-(--gray-12)">
            {material?.name ?? "Code Problem"}
          </span>
          <span className="text-xs text-(--gray-10)">{maxScore} pts</span>
          {renderStatus()}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSubmit}
          disabled={
            submitMutation.isPending ||
            status === "grading" ||
            !selectedRunner?.id ||
            isLoading
          }
        >
          {submitMutation.isPending || status === "grading" ? (
            <>
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CloudUpload className="mr-1.5 h-3 w-3" />
              Submit
            </>
          )}
        </Button>
      </div>
      <div className="h-[520px] flex flex-col">
        <CodeEditor
          files={editorFiles}
          onFilesChange={handleFilesChange}
          permissions={{
            writeFiles: true,
            modifyFiles: false,
            codeExecution: false,
            selectRunner: true,
          }}
          allowedRunners={allowedRunners}
          initialSelectedRunner={selectedRunner}
          onChangeSelectedRunner={handleRunnerChange}
          isLoading={isLoading}
          isReadonlyFile={(name) => resourceFileNames.has(name)}
        />
      </div>
    </div>
  );
}
