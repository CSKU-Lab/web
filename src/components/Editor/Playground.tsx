import {
  Clock,
  GripHorizontal,
  GripVertical,
  LoaderCircle,
  MemoryStick,
  Play,
} from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import useDrag from "~/hooks/useDrag";
import { useState } from "react";
import type { CodeExecutionResult } from "~/types/code-execution-result";
import { env } from "~/lib/env";
import type { CodeFile } from "~/types/code-material";
import { kiloToMegaBytes } from "./utils/kilo-to-megabytes";

interface Props {
  runnerID: string;
  files: CodeFile[];
  onError(error: "NO_RUNNER" | null): void;
  disabled?: boolean;
}

function Playground({ runnerID, files, onError, disabled }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

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
    if (runnerID === "") {
      onError("NO_RUNNER");
      return;
    }
    setResult(null);
    const res = await fetch(env("API_URL") + "/playground/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        files,
        input,
        runner_id: runnerID,
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedData = decoder.decode(value, { stream: true });
      const messages = decodedData.split("\n\n");
      messages.pop();

      for (const message of messages) {
        if (!message.trim()) continue;
        const lines = message.split("\n");
        const eventLine = lines.find((l) => l.startsWith("event:"));
        const dataLine = lines.find((l) => l.startsWith("data:"));
        if (eventLine && dataLine) {
          const event = eventLine.slice(6).trim();
          if (event === "done") break;

          const data = JSON.parse(dataLine.slice(5)) as CodeExecutionResult;

          if (
            data.status !== "STATUS_QUEUED" &&
            data.status !== "STATUS_RUNNING"
          ) {
            setOutput(data.output);
          }
          setResult(data);
        }
      }
    }
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
        className="w-8 h-4 bg-white border rounded absolute -top-2 z-20 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing active:bg-white/90 flex items-center justify-center"
      >
        <GripHorizontal size="0.9rem" />
      </button>
      <div className="bg-white border-b p-4 flex justify-between items-center z-10">
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
      <div className="flex flex-1 min-h-0 overflow-hidden" ref={splitContainerRef}>
        {/* Input panel */}
        <div className="flex flex-col overflow-hidden" style={{ width: `${splitPercent}%` }}>
          <div className="bg-(--gray-3) border-b px-3 py-2 shrink-0">
            <span className="text-xs font-medium text-(--gray-11)">Input</span>
          </div>
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <button
              onClick={handleRunCode}
              disabled={isRunning || disabled}
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
              className="h-full overflow-auto"
            />
          </div>
        </div>

        {/* Horizontal drag handle */}
        <button
          {...splitEvents}
          ref={splitButtonRef}
          className="w-4 h-full bg-white border-l border-r cursor-grab active:cursor-grabbing active:bg-white/90 flex items-center justify-center shrink-0"
        >
          <GripVertical size="0.9rem" />
        </button>

        {/* Output panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="bg-(--gray-3) border-b px-3 py-2 shrink-0">
            <span className="text-xs font-medium text-(--gray-11)">Output</span>
          </div>
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <CodeMirror
              readOnly
              value={output}
              className="h-full overflow-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;
