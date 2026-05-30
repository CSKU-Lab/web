import { useState, useEffect } from "react";
import {
  Clock,
  GripHorizontal,
  GripVertical,
  LoaderCircle,
  MemoryStick,
  Play,
  Terminal,
} from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import CodeMirror from "~/components/Editor/CodeMirror";
import useDrag from "~/hooks/useDrag";
import type { CodeExecutionResult } from "~/types/code-execution-result";
import { env } from "~/lib/env";
import {
  buildScriptAtom,
  runScriptAtom,
  filesWithoutPrefixAtom,
  compareFilesAtom,
  compareTestRunningAtom,
} from "../../stores/compare-files.store";
import { saveStatusAtom } from "../../stores/save-status.store";
import { fetchSSE } from "~/lib/sse-handler";

const kiloToMegaBytes = (kb: number) => (kb / 1024).toFixed(2);

function ExitCodeBadge({ exitCode }: { exitCode: number }) {
  if (exitCode === 0) {
    return (
      <span className="text-xs px-2 py-0.5 rounded bg-green-500/15 text-green-600 font-mono">
        exit 0 · Accepted
      </span>
    );
  }
  if (exitCode === 1) {
    return (
      <span className="text-xs px-2 py-0.5 rounded bg-red-500/15 text-red-600 font-mono">
        exit 1 · Wrong Answer
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded bg-orange-500/15 text-orange-600 font-mono">
      exit {exitCode} · Error
    </span>
  );
}

interface ComparePlaygroundProps {
  compareId: string;
  disabled?: boolean;
}

function ComparePlayground({ compareId, disabled }: ComparePlaygroundProps) {
  const [solOutput, setSolOutput] = useState("");
  const [studentOutput, setStudentOutput] = useState("");

  const buildScript = useAtomValue(buildScriptAtom);
  const runScript = useAtomValue(runScriptAtom);
  const files = useAtomValue(filesWithoutPrefixAtom);
  const setCompareFiles = useSetAtom(compareFilesAtom);
  const setTestRunning = useSetAtom(compareTestRunningAtom);
  const saveStatus = useAtomValue(saveStatusAtom);

  useEffect(() => {
    return () => {
      setTestRunning(false);
    };
  }, [setTestRunning]);

  const injectCompareResult = (content: string) => {
    setCompareFiles((prev) => {
      const without = prev.filter((f) => f.name !== "sandbox/compare_result.txt");
      return [...without, { name: "sandbox/compare_result.txt", content }];
    });
  };


  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 240,
    direction: "vertical",
  });

  const {
    buttonRef: splitButtonRef,
    containerRef: splitContainerRef,
    size: splitPercent,
    events: splitEvents,
  } = useDrag({
    initialSize: 50,
    direction: "horizontal",
    mode: "percent",
  });

  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const isRunning =
    result?.status === "STATUS_RUNNING" || result?.status === "STATUS_QUEUED";
  const isUnsaved = saveStatus !== "Saved";

  const handleRunCode = async () => {
    if (!compareId) return;

    setTestRunning(true);
    fetchSSE(env("API_URL") + `/cms/configs/compare-scripts/${compareId}/test`, {
      method: "POST",
      body: {
        build_script: buildScript,
        run_script: runScript,
        files: files,
        sol_output: solOutput,
        output: studentOutput,
      },
      onMessage: (_, message) => {
        const data = JSON.parse(message) as CodeExecutionResult;
        setResult(data);
        const isFinished =
          data.status !== "STATUS_RUNNING" && data.status !== "STATUS_QUEUED";
        if (isFinished) {
          injectCompareResult(data.compare_result ?? "");
        }
      },
      onError: (err) => console.log(err),
      onClose: () => {
        setTestRunning(false);
      },
    });
  };

  return (
    <div
      className="flex flex-col border-t min-h-20 relative"
      ref={containerRef}
      style={{ height: size }}
    >
      <button
        {...events}
        ref={buttonRef}
        className="w-8 h-4 bg-(--gray-1) border rounded absolute -top-2 z-20 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing active:bg-(--gray-1)/90 flex items-center justify-center"
      >
        <GripHorizontal size="0.9rem" />
      </button>

      {/* Header */}
      <div className="bg-(--gray-1) border-b p-4 flex justify-between items-center z-10 shrink-0">
        <h4 className="text-xs text-(--gray-11)">Playground</h4>
        {result !== null && !isRunning && (
          <div className="flex items-center gap-3">
            <ExitCodeBadge exitCode={result.exit_code ?? 0} />
            <div className="flex items-center gap-1">
              <Clock size="1rem" />
              <span className="text-xs">{result.wall_time ?? 0} s</span>
            </div>
            <div className="flex items-center gap-1">
              <MemoryStick size="1rem" />
              <span className="text-xs">
                {kiloToMegaBytes(result.memory ?? 0)} MB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0" ref={splitContainerRef}>
        {/* Left: sol_output + student output stacked equally */}
        <div
          className="flex flex-col min-h-0"
          style={{ width: `${splitPercent}%` }}
        >
          {/* Expected output (sol_output) */}
          <div className="flex flex-col flex-1 min-h-0 border-b">
            <div className="bg-(--gray-3) border-b px-3 py-2 shrink-0 flex items-center justify-between">
              <span className="text-xs font-medium text-(--gray-11)">
                Expected Output{" "}
                <span className="text-(--gray-9) font-normal">($SOL_OUTPUT)</span>
              </span>
              <button
                onClick={handleRunCode}
                disabled={isRunning || disabled || !compareId || isUnsaved}
                title={isUnsaved ? "Save before running" : undefined}
                className="bg-(--gray-12) hover:bg-(--gray-12)/80 text-(--gray-1) p-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <LoaderCircle size="0.85rem" className="animate-spin" />
                ) : (
                  <Play size="0.85rem" />
                )}
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <CodeMirror
                onChange={(value: string) => setSolOutput(value)}
                readOnly={disabled}
                value={solOutput}
                className="h-full"
              />
            </div>
          </div>

          {/* Student output (output) */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="bg-(--gray-3) border-b px-3 py-2 shrink-0">
              <span className="text-xs font-medium text-(--gray-11)">
                Student Output{" "}
                <span className="text-(--gray-9) font-normal">($OUTPUT)</span>
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <CodeMirror
                onChange={(value: string) => setStudentOutput(value)}
                readOnly={disabled}
                value={studentOutput}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Horizontal drag handle */}
        <button
          {...splitEvents}
          ref={splitButtonRef}
          className="w-4 h-full bg-(--gray-1) border-l border-r cursor-grab active:cursor-grabbing active:bg-(--gray-1)/90 flex items-center justify-center shrink-0"
        >
          <GripVertical size="0.9rem" />
        </button>

        {/* Right: stdout output */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="bg-(--gray-3) border-b px-3 py-2 flex items-center gap-2 shrink-0">
            <Terminal size="0.9rem" className="text-(--gray-11)" />
            <span className="text-xs font-medium text-(--gray-11)">stdout</span>
          </div>
          <div className="flex-1 min-h-0">
            <CodeMirror readOnly value={result?.output ?? ""} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparePlayground;
