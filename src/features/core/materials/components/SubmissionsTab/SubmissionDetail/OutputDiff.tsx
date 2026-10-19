import { Fragment, useMemo } from "react";
import { diffLines } from "diff";
import { cn } from "~/lib/utils";

interface Props {
  expected: string;
  actual: string;
}

type CellKind = "same" | "expected" | "actual" | "empty";

interface Cell {
  kind: CellKind;
  lineNo?: number;
  text: string;
}

interface Row {
  left: Cell;
  right: Cell;
}

const EMPTY: Cell = { kind: "empty", text: "" };

// splitLines breaks a diff chunk into its lines. jsdiff keeps the trailing
// "\n" on each chunk, so drop the empty tail it would otherwise produce.
function splitLines(value: string): string[] {
  const lines = value.split("\n");
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

// buildRows lays the line diff out side by side: unchanged lines on both
// sides, and each removed block paired row by row with the added block that
// replaces it, padding the shorter side with empty cells.
function buildRows(expected: string, actual: string): Row[] {
  const rows: Row[] = [];
  let leftNo = 1;
  let rightNo = 1;
  let removed: string[] = [];

  const flushRemoved = (added: string[]) => {
    const n = Math.max(removed.length, added.length);
    for (let i = 0; i < n; i++) {
      rows.push({
        left:
          i < removed.length
            ? { kind: "expected", lineNo: leftNo++, text: removed[i]! }
            : EMPTY,
        right:
          i < added.length
            ? { kind: "actual", lineNo: rightNo++, text: added[i]! }
            : EMPTY,
      });
    }
    removed = [];
  };

  for (const change of diffLines(expected, actual)) {
    const lines = splitLines(change.value);
    if (change.removed) {
      removed.push(...lines);
    } else if (change.added) {
      flushRemoved(lines);
    } else {
      flushRemoved([]);
      for (const text of lines) {
        rows.push({
          left: { kind: "same", lineNo: leftNo++, text },
          right: { kind: "same", lineNo: rightNo++, text },
        });
      }
    }
  }
  flushRemoved([]);
  return rows;
}

const cellClass: Record<CellKind, string> = {
  same: "text-(--gray-11)",
  expected: "bg-(--red-3) text-(--red-11)",
  actual: "bg-(--grass-3) text-(--grass-11)",
  empty: "bg-(--gray-3)",
};

function DiffCell({ cell, divider }: { cell: Cell; divider?: boolean }) {
  return (
    <>
      <span
        className={cn(
          "px-2 text-right text-(--gray-9) select-none",
          cellClass[cell.kind],
        )}
      >
        {cell.lineNo ?? ""}
      </span>
      {/* Wrap instead of scrolling so both sides of a row stay aligned. Keep
          blank lines one row tall so they stay visible. */}
      <span
        className={cn(
          "pr-2 whitespace-pre-wrap break-all",
          divider && "border-r border-gray-4",
          cellClass[cell.kind],
        )}
      >
        {cell.text || " "}
      </span>
    </>
  );
}

// OutputDiff renders a side-by-side line diff of the test case's expected
// output against the student's actual output. Callers must cap both strings
// first: diffing is O(N·D) and mounts one node per line.
function OutputDiff({ expected, actual }: Props) {
  const rows = useMemo(() => buildRows(expected, actual), [expected, actual]);
  const isIdentical = rows.every((r) => r.left.kind === "same");

  return (
    <div className="space-y-1">
      <span className="text-xs text-(--gray-11)">Diff</span>
      {isIdentical ? (
        <div className="p-2 text-xs text-(--gray-9) italic border border-gray-4 rounded-md">
          No differences.
        </div>
      ) : (
        <div className="max-h-[400px] overflow-auto border border-gray-4 rounded-md font-mono text-sm">
          <div className="grid grid-cols-[auto_1fr_auto_1fr]">
            <div className="col-span-2 sticky top-0 px-2 py-1 text-xs font-sans text-(--red-11) bg-(--gray-2) border-b border-r border-gray-4">
              Expected Output
            </div>
            <div className="col-span-2 sticky top-0 px-2 py-1 text-xs font-sans text-(--grass-11) bg-(--gray-2) border-b border-gray-4">
              Student Output
            </div>
            {rows.map((row, i) => (
              <Fragment key={i}>
                <DiffCell cell={row.left} divider />
                <DiffCell cell={row.right} />
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OutputDiff;
