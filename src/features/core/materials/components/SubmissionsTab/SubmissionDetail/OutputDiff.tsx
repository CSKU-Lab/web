import { useMemo } from "react";
import { diffLines } from "diff";
import { cn } from "~/lib/utils";

interface Props {
  expected: string;
  actual: string;
}

type LineKind = "same" | "expected" | "actual";

interface DiffLine {
  kind: LineKind;
  text: string;
}

// splitLines breaks a diff chunk into its lines. jsdiff keeps the trailing
// "\n" on each chunk, so drop the empty tail it would otherwise produce.
function splitLines(value: string): string[] {
  const lines = value.split("\n");
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

const lineClass: Record<LineKind, string> = {
  same: "text-(--gray-11)",
  expected: "bg-(--red-3) text-(--red-11)",
  actual: "bg-(--grass-3) text-(--grass-11)",
};

const lineSign: Record<LineKind, string> = {
  same: " ",
  expected: "-",
  actual: "+",
};

// OutputDiff renders a line diff of the test case's expected output against the
// student's actual output. Callers must cap both strings first: diffing is
// O(N·D) and mounts one node per line.
function OutputDiff({ expected, actual }: Props) {
  const lines = useMemo<DiffLine[]>(
    () =>
      diffLines(expected, actual).flatMap((change) => {
        const kind: LineKind = change.removed
          ? "expected"
          : change.added
            ? "actual"
            : "same";
        return splitLines(change.value).map((text) => ({ kind, text }));
      }),
    [expected, actual],
  );

  const isIdentical = lines.every((l) => l.kind === "same");

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 text-xs">
        <span className="text-(--gray-11)">Diff</span>
        <span className="text-(--red-11)">- Expected</span>
        <span className="text-(--grass-11)">+ Student output</span>
      </div>
      {isIdentical ? (
        <div className="p-2 text-xs text-(--gray-9) italic border border-gray-4 rounded-md">
          No differences.
        </div>
      ) : (
        <pre className="max-h-[400px] overflow-auto py-2 font-mono text-sm border border-gray-4 rounded-md">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn("flex px-2 whitespace-pre", lineClass[line.kind])}
            >
              <span className="w-4 shrink-0 select-none">
                {lineSign[line.kind]}
              </span>
              {/* Keep blank lines one row tall so they stay visible. */}
              <span>{line.text || " "}</span>
            </div>
          ))}
        </pre>
      )}
    </div>
  );
}

export default OutputDiff;
