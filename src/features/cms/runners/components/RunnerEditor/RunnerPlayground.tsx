import { useState } from "react";
import {
  Clock,
  GripHorizontal,
  GripVertical,
  LoaderCircle,
  MemoryStick,
  Play,
} from "lucide-react";
import { useAtomValue } from "jotai";
import CodeMirror from "~/components/Editor/CodeMirror";
import useDrag from "~/hooks/useDrag";
import type { CodeExecutionResult } from "~/types/code-execution-result";
import { env } from "~/lib/env";
import {
  buildScriptAtom,
  runScriptAtom,
  initialFilesWithoutPrefixAtom,
} from "../../stores/runner-files.store";
import { fetchSSE } from "~/lib/sse-handler";

const kiloToMegaBytes = (kb: number) => (kb / 1024).toFixed(2);

interface RunnerPlaygroundProps {
  runnerId: string;
  disabled?: boolean;
}

function RunnerPlayground({ runnerId, disabled }: RunnerPlaygroundProps) {
  const [input, setInput] = useState("");

  const buildScript = useAtomValue(buildScriptAtom);
  const runScript = useAtomValue(runScriptAtom);
  const initialFiles = useAtomValue(initialFilesWithoutPrefixAtom);

  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 200,
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

  const handleRunCode = async () => {
    if (!runnerId) {
      return;
    }

    fetchSSE(env("API_URL") + `/cms/configs/runners/${runnerId}/test`, {
      method: "POST",
      body: {
        input,
        build_script: buildScript,
        run_script: runScript,
        initial_files: initialFiles,
      },
      onMessage: (_, message) => {
        const data = JSON.parse(message) as CodeExecutionResult;
        setResult(data);
      },
      onError: (err) => console.log(err),
      onClose: () => {
        console.log("SSE connection closed");
      },
    });
  };
  console.log("Render Playground", { result });

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
      <div className="bg-(--gray-1) border-b p-4 flex justify-between items-center z-10">
        <h4 className="text-xs text-(--gray-11)">Playground</h4>
        {result !== null && !isRunning && (
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Clock size="1rem" />
              <span className="text-xs">{result?.wall_time ?? 0} s</span>
            </div>
            <div className="flex items-center gap-1">
              <MemoryStick size="1rem" />
              <span className="text-xs">
                {kiloToMegaBytes(result?.memory ?? 0)} MB
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 min-h-0" ref={splitContainerRef}>
        {/* Input panel */}
        <div className="flex flex-col" style={{ width: `${splitPercent}%` }}>
          <div className="bg-(--gray-3) border-b px-3 py-2">
            <span className="text-xs font-medium text-(--gray-11)">Input</span>
          </div>
          <div className="flex-1 relative">
            <button
              onClick={handleRunCode}
              disabled={isRunning || disabled || !runnerId}
              className="absolute bottom-2 right-2 z-10 bg-(--gray-12) hover:bg-(--gray-12)/80 text-(--gray-1) p-2 text-xs backdrop-blur-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <LoaderCircle size="1rem" className="animate-spin" />
              ) : (
                <Play size="1rem" />
              )}
            </button>
            <CodeMirror
              onChange={(value: string) => setInput(value)}
              readOnly={disabled}
              value={input}
              className="h-full"
            />
          </div>
        </div>

        {/* Horizontal drag handle */}
        <button
          {...splitEvents}
          ref={splitButtonRef}
          className="w-4 h-full bg-(--gray-1) border-l border-r cursor-grab active:cursor-grabbing active:bg-(--gray-1)/90 flex items-center justify-center"
        >
          <GripVertical size="0.9rem" />
        </button>

        {/* Output panel */}
        <div className="flex flex-col flex-1">
          <div className="bg-(--gray-3) border-b px-3 py-2">
            <span className="text-xs font-medium text-(--gray-11)">Output</span>
          </div>
          <div className="flex-1 relative">
            <CodeMirror readOnly value={result?.output} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RunnerPlayground;
