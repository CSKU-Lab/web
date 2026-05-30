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
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { isMac } from "~/lib/tiptap-utils";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import type { CodeExecutionResult } from "~/types/code-execution-result";
import { env } from "~/lib/env";
import type { CodeFile } from "~/types/code-material";
import { kiloToMegaBytes } from "./utils/kilo-to-megabytes";

export interface PlaygroundHandle {
  run: () => void;
}

interface Props {
  runnerID: string;
  files: CodeFile[];
  onError(error: "NO_RUNNER" | null): void;
  disabled?: boolean;
}

const Playground = forwardRef<PlaygroundHandle, Props>(function Playground(
  { runnerID, files, onError, disabled },
  ref,
) {
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

  const handleRunCodeRef = useRef<() => void>(() => {});

  useImperativeHandle(ref, () => ({
    run: () => { if (!isRunning && !disabled) handleRunCodeRef.current(); },
  }), [isRunning, disabled]);

  const runKeymap = useMemo(
    () =>
      Prec.highest(
        keymap.of([
          {
            key: "Ctrl-Enter",
            mac: "Cmd-Enter",
            run: () => {
              if (!isRunning && !disabled) handleRunCodeRef.current();
              return true;
            },
          },
        ]),
      ),
    [isRunning, disabled],
  );

  useHotkeys("ctrl+enter", () => handleRunCode(), {
    enabled: !isRunning && !disabled,
    preventDefault: true,
    enableOnFormTags: true,
  });

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
  handleRunCodeRef.current = handleRunCode;

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
            <div className="absolute inset-0">
              <CodeMirror
                onChange={(value: string) => setInput(value)}
                readOnly={disabled}
                value={input}
                className="h-full"
                extensions={[runKeymap]}
              />
            </div>
            <div className="absolute bottom-2 right-2 z-10 group">
              <kbd className="absolute -top-7 left-1/2 -translate-x-1/2 hidden sm:inline-flex items-center rounded border border-(--gray-6) bg-(--gray-2) px-1 py-0.5 text-[10px] text-(--gray-10) font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {isMac() ? "⌘↵" : "Ctrl+↵"}
              </kbd>
              <button
                onClick={handleRunCode}
                disabled={isRunning || disabled}
                className="bg-(--gray-12) hover:bg-(--gray-12)/80 text-(--gray-1) p-2 text-xs backdrop-blur-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <LoaderCircle size="1rem" className="animate-spin" />
                ) : (
                  <Play size="1rem" />
                )}
              </button>
            </div>
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
            <div className="absolute inset-0">
              <CodeMirror
                readOnly
                value={output}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Playground;
