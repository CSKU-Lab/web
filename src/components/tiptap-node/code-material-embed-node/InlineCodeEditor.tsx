"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import CodeEditor from "~/components/Editor/CodeEditor";
import { SubmitCooldownButton } from "~/components/ui/submit-cooldown-button";
import { useSubmitCooldown } from "~/hooks/useSubmitCooldown";
import { firePassConfetti } from "~/lib/confetti";
import { fireFailGlitch } from "~/lib/glitch";
import { coreMaterialService } from "~/services/core-material.service";
import { coreSubmissionService } from "~/services/core-submission.service";
import type { CoreCodeMaterial } from "~/types/core-code-material";
import type { Runner } from "~/components/Editor/types/runner";
import type { CodeFile, SegmentType, TemplateFile } from "~/components/Editor/types/editor";
import type { CodeSubmissionPayload, CodeSubmissionDetail } from "~/types/core-code-submission";
import {
  templateFileToCodeFile,
  buildSubmittedFiles,
  attachSolutionSegments,
  applyEditableSegments,
} from "~/components/Editor/utils/segments";
import type { MaterialDetail } from "~/types/core-material";
import { queryKeys } from "~/queryKeys";

interface Props {
  materialID: string;
  sectionID: string;
  labID: string;
}

type SubmissionStatus = "idle" | "grading" | "passed" | "failed";

export function InlineCodeEditor({ materialID, sectionID, labID }: Props) {
  const queryClient = useQueryClient();
  const cooldown = useSubmitCooldown();
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [templateFiles, setTemplateFiles] = useState<TemplateFile[]>([]);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [score, setScore] = useState<number | null>(null);
  // Bumped when `files` is replaced wholesale (hydrated submission, runner load)
  // so CodeEditor remounts CodeMirror and rebuilds readonly ranges — a plain
  // value swap after mount is rejected by the readonly transaction filter.
  const [filesEpoch, setFilesEpoch] = useState(0);

  // The page route is the parent DOCUMENT material; its query drives the
  // document-level status pill, which aggregates these embeds server-side.
  const params = useParams();
  const documentMaterialID = params.materialID as string;

  // Defer mounting the CodeMirror editor until its area scrolls into view.
  // Safari scrolls the nearest scroll container to reveal a contenteditable
  // the moment it's inserted into the DOM, so an off-screen editor mounting on
  // page load yanks the page down to the first embed. Mounting only when the
  // area is already visible avoids the jump (and is cheaper — each editor is a
  // heavy CodeMirror + LSP instance).
  const editorAreaRef = useRef<HTMLDivElement>(null);
  const [editorVisible, setEditorVisible] = useState(false);
  useEffect(() => {
    const el = editorAreaRef.current;
    if (!el || editorVisible) return;
    if (typeof IntersectionObserver === "undefined") {
      setEditorVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEditorVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [editorVisible]);

  // Track latest status without re-creating the hydration effect, so a
  // late-resolving hydration fetch never clobbers a fresh submission.
  const statusRef = useRef<SubmissionStatus>("idle");
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  // Hydrate from server only once per mount.
  const hydratedRef = useRef(false);

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
        initial_files: r.files.map((f): TemplateFile => ({
          name: f.name,
          segments: f.segments && f.segments.length > 0
            ? f.segments.map((s) => ({ content: s.content, type: s.type as SegmentType }))
            : [{ content: f.content, type: "editable" as const }],
        })),
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
    setTemplateFiles(first.initial_files);
    setFiles(first.initial_files.map(templateFileToCodeFile));
  }, [material, selectedRunner, allowedRunners]);

  const handleRunnerChange = useCallback((runner: Runner) => {
    setSelectedRunner(runner);
    setTemplateFiles(runner.initial_files);
    setFiles(runner.initial_files.map(templateFileToCodeFile));
  }, []);

  // Restart: discard the student's edits and reload the current runner template.
  const handleRestart = useCallback(() => {
    if (!selectedRunner) return;
    setFiles(selectedRunner.initial_files.map(templateFileToCodeFile));
    // Wholesale replacement — remount the editor so readonly ranges rebuild.
    setFilesEpoch((e) => e + 1);
  }, [selectedRunner]);

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
              if (data.status === "passed") {
                firePassConfetti();
              } else {
                fireFailGlitch();
              }
              if (typeof data.auto_score === "number") {
                setScore(data.auto_score);
              }
              es.close();
              queryClient.invalidateQueries({
                queryKey: ["inline-code-material", materialID, sectionID, labID],
              });
              // Refresh the parent document's status pill, which aggregates the
              // latest status of every embedded code block server-side.
              queryClient.invalidateQueries({
                queryKey: queryKeys.core.material.getById(documentMaterialID),
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
    [materialID, sectionID, labID, queryClient, documentMaterialID],
  );

  // Restore submission state when the material is (re)opened. The material
  // query only carries the latest status, not the achieved score or the
  // submission id, so fetch the latest submission as the source of truth:
  // terminal -> show result, in-flight -> resume listening for the grader.
  useEffect(() => {
    if (hydratedRef.current) return;
    if (!material || !materialID || !sectionID || !labID) return;
    hydratedRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const res =
          await coreSubmissionService.getSubmissionPagination<CodeSubmissionPayload>(
            { page: 1, page_size: 1, sort_by: "created_at", sort_order: "desc" },
            materialID,
            labID,
            sectionID,
          );
        const latest = res.data?.[0];
        // Bail if there is no prior submission, or the user already submitted
        // while this fetch was in flight (don't overwrite the live state).
        if (cancelled || !latest || statusRef.current !== "idle") return;

        // Load the student's submitted code back into the editor. Restoring only
        // status/score leaves the editor showing the runner template, so the
        // student would see the initial code instead of their latest submission.
        const restoreFiles = async () => {
          const detail =
            await coreSubmissionService.getByID<CodeSubmissionDetail>(latest.id);
          if (cancelled) return;

          // Prefer the exact runner the submission used. Older submissions don't
          // carry runner_id, so fall back to matching by file names (each
          // runner's template is language-specific), then the first runner.
          const submittedNames = detail.payload.files.map((f) => f.name);
          const runner =
            (detail.payload.runner_id
              ? allowedRunners.find((r) => r.id === detail.payload.runner_id)
              : undefined) ??
            allowedRunners.find((r) =>
              submittedNames.every((n) =>
                r.initial_files.some((f) => f.name === n),
              ),
            ) ??
            allowedRunners[0];
          if (!runner) return;

          // Rebuild each file from the runner template. When the backend
          // persisted the student's indexed editable segments, splice them in for
          // an exact restore (correct readonly ranges + resubmission). Older
          // submissions only have flat content, so align that content instead.
          const restored = detail.payload.files.map((file) => {
            const template = runner.initial_files.find(
              (t) => t.name === file.name,
            );
            if (template && file.editable_segments?.length) {
              return applyEditableSegments(template, file.editable_segments);
            }
            return attachSolutionSegments([file], runner.initial_files)[0];
          });

          setSelectedRunner(runner);
          setTemplateFiles(runner.initial_files);
          setFiles(restored);
          // Wholesale replacement — remount the editor so readonly ranges rebuild.
          setFilesEpoch((e) => e + 1);
        };

        if (latest.status === "passed" || latest.status === "failed") {
          setStatus(latest.status);
          setScore(latest.auto_score ?? null);
          await restoreFiles();
        } else if (latest.status === "queued" || latest.status === "running") {
          setStatus("grading");
          listenForResult(latest.id);
          await restoreFiles();
        }
      } catch {
        // Leave as idle on failure; the student can resubmit.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [material, materialID, sectionID, labID, listenForResult, allowedRunners]);

  const submitMutation = useMutation({
    mutationFn: () =>
      coreSubmissionService.create<CodeSubmissionPayload>({
        material_id: materialID,
        section_id: sectionID,
        lab_id: labID,
        payload: {
          files: buildSubmittedFiles(templateFiles, files),
          runner_id: selectedRunner?.id ?? "",
        },
      }),
    onSuccess: (response) => {
      setStatus("grading");
      setScore(null);
      listenForResult(response.data.id);
      // Flip the parent document pill to Grading right away.
      queryClient.invalidateQueries({
        queryKey: queryKeys.core.material.getById(documentMaterialID),
      });
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
    cooldown.start();
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

  return (
    <div className="border rounded-lg my-4 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-(--gray-2) border-b shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-(--gray-12)">
            {material?.name ?? "Code Problem"}
          </span>
          {renderStatus()}
        </div>
        <SubmitCooldownButton
          onClick={handleSubmit}
          cooldown={cooldown}
          isSubmitting={submitMutation.isPending || status === "grading"}
          disabled={!selectedRunner?.id || isLoading}
          iconClassName="mr-1.5 h-3 w-3"
        />
      </div>
      <div ref={editorAreaRef} className="h-[520px] flex flex-col">
        {editorVisible ? (
          <CodeEditor
            files={editorFiles}
            onFilesChange={handleFilesChange}
            permissions={{
              writeFiles: true,
              modifyFiles: false,
              codeExecution: true,
              selectRunner: true,
            }}
            allowedRunners={allowedRunners}
            initialSelectedRunner={selectedRunner}
            onChangeSelectedRunner={handleRunnerChange}
            onRestart={handleRestart}
            isLoading={isLoading}
            isReadonlyFile={(name) => resourceFileNames.has(name)}
            resetKey={filesEpoch}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-(--gray-10)">
            <Loader2 size="1.25rem" className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
