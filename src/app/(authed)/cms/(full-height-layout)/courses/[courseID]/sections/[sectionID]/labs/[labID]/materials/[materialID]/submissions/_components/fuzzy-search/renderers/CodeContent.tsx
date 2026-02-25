"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { FuseResultMatch } from "fuse.js";
import type { CodeSubmissionData } from "~/types/cms-section-submission";
import { FuzzySearchHighlight } from "../../FuzzySearchHighlight";

interface CodeContentProps {
  payload: CodeSubmissionData;
  matches: readonly FuseResultMatch[];
}

const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    py: "python",
    js: "javascript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    c: "c",
    java: "java",
    go: "go",
  };
  return map[ext] ?? "plaintext";
};

const getFileEmoji = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    py: "🐍",
    js: "📜",
    ts: "🔷",
    jsx: "⚛️",
    tsx: "⚛️",
    cpp: "⚙️",
    cc: "⚙️",
    cxx: "⚙️",
    c: "⚙️",
    java: "☕",
    go: "🐹",
  };
  return map[ext] ?? "📄";
};

const CONTEXT_LINES = 2;

interface Hunk {
  startLine: number; // 0-indexed, inclusive
  endLine: number;   // 0-indexed, inclusive
  lines: string[];
}

/**
 * Converts Fuse char-offset indices into a list of hunks (contiguous line
 * groups with CONTEXT_LINES padding), merged when they overlap or touch.
 * Falls back to the first 5 lines when there are no match indices.
 */
function getHunks(
  content: string,
  indices: readonly [number, number][] | undefined,
): Hunk[] {
  const allLines = content.split("\n");

  if (!indices || indices.length === 0) {
    return [
      {
        startLine: 0,
        endLine: Math.min(4, allLines.length - 1),
        lines: allLines.slice(0, 5),
      },
    ];
  }

  // Build cumulative line-start offsets so we can map char → line number
  const lineStart: number[] = [];
  let offset = 0;
  for (const line of allLines) {
    lineStart.push(offset);
    offset += line.length + 1; // +1 for the \n
  }

  const charToLine = (charOffset: number): number => {
    // Binary search for the last lineStart ≤ charOffset
    let lo = 0;
    let hi = lineStart.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (lineStart[mid] <= charOffset) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };

  // Collect all matched line numbers
  const matchedLines = new Set<number>();
  for (const [start, end] of indices) {
    const startLine = charToLine(start);
    const endLine = charToLine(end);
    for (let l = startLine; l <= endLine; l++) {
      matchedLines.add(l);
    }
  }

  // Expand each matched line by CONTEXT_LINES, then merge overlapping ranges
  const ranges: [number, number][] = [];
  for (const line of matchedLines) {
    ranges.push([
      Math.max(0, line - CONTEXT_LINES),
      Math.min(allLines.length - 1, line + CONTEXT_LINES),
    ]);
  }
  ranges.sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [];
  for (const [s, e] of ranges) {
    if (merged.length > 0 && s <= merged[merged.length - 1][1] + 1) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    } else {
      merged.push([s, e]);
    }
  }

  return merged.map(([s, e]) => ({
    startLine: s,
    endLine: e,
    lines: allLines.slice(s, e + 1),
  }));
}

interface HunkBlockProps {
  hunk: Hunk;
  language: string;
}

function HunkBlock({ hunk, language }: HunkBlockProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const preview = hunk.lines.join("\n");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlightedHtml("");
    codeToHtml(preview, { lang: language, theme: "github-light" }).then(
      (html) => {
        if (!cancelled) setHighlightedHtml(html);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [preview, language]);

  return (
    <div>
      {/* Line-number label */}
      <div className="px-3 py-1 text-[10px] text-(--gray-9) bg-(--gray-3) font-mono border-b border-(--gray-4) select-none">
        line {hunk.startLine + 1}–{hunk.endLine + 1}
      </div>
      {highlightedHtml ? (
        <div
          className="px-3 py-2 leading-relaxed [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!text-xs"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <div className="px-3 py-2 text-(--gray-11) leading-relaxed whitespace-pre text-xs">
          {preview}
        </div>
      )}
    </div>
  );
}

interface CodeFilePreviewProps {
  file: { name: string; content: string };
  matches: readonly FuseResultMatch[];
  fileIndex: number;
}

function CodeFilePreview({ file, matches, fileIndex }: CodeFilePreviewProps) {
  const language = getLanguageFromExtension(file.name);

  const contentMatch = matches.find(
    (m) => m.key === "payload.files.content" && m.refIndex === fileIndex,
  );
  const fileMatch = matches.find(
    (m) => m.key === "payload.files.name" && m.refIndex === fileIndex,
  );

  const hunks = getHunks(file.content, contentMatch?.indices);
  const totalLines = file.content.split("\n").length;

  return (
    <div className="space-y-1.5">
      {/* Filename row */}
      <div className="flex items-center gap-1.5 text-xs text-(--gray-11)">
        <span>{getFileEmoji(file.name)}</span>
        {fileMatch ? (
          <FuzzySearchHighlight
            text={file.name}
            matches={matches}
            matchKey="payload.files.name"
            className="font-mono"
          />
        ) : (
          <span className="font-mono">{file.name}</span>
        )}
        <span className="text-(--gray-9) ml-auto">
          {totalLines} lines
        </span>
      </div>

      {/* Hunks — rendered like git file changes */}
      <div className="text-xs font-mono bg-(--gray-2) rounded-md overflow-hidden divide-y divide-(--gray-4)">
        {hunks.map((hunk, i) => (
          <div key={i}>
            {/* Ellipsis before first hunk if it doesn't start at line 1 */}
            {i === 0 && hunk.startLine > 0 && (
              <div className="px-3 py-1 text-(--gray-9) select-none">…</div>
            )}
            <HunkBlock hunk={hunk} language={language} />
            {/* Ellipsis after each hunk that doesn't reach the last line */}
            {hunk.endLine < totalLines - 1 && (
              <div className="px-3 py-1 text-(--gray-9) select-none border-t border-(--gray-4)">…</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CodeContent({ payload, matches }: CodeContentProps) {
  const passedTests = payload.test_case_groups.reduce(
    (acc, group) =>
      acc + group.results.filter((r) => r.status === "RUN_PASSED").length,
    0,
  );
  const totalTests = payload.test_case_groups.reduce(
    (acc, group) => acc + group.results.length,
    0,
  );

  return (
    <div className="space-y-3">
      {payload.files.slice(0, 3).map((file, idx) => (
        <CodeFilePreview
          key={idx}
          file={file}
          matches={matches}
          fileIndex={idx}
        />
      ))}
      {payload.files.length > 3 && (
        <p className="text-xs text-(--gray-10) italic">
          +{payload.files.length - 3} more files
        </p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-(--gray-11) pt-2 border-t border-(--gray-4)">
        <span
          className={
            passedTests === totalTests
              ? "text-green-600 font-semibold"
              : "text-amber-600 font-semibold"
          }
        >
          {passedTests}/{totalTests}
        </span>
        <span>tests</span>
        <span className="text-(--gray-6)">·</span>
        <span>{(payload.avg_wall_time / 1000).toFixed(2)}s avg</span>
        <span className="text-(--gray-6)">·</span>
        <span>{(payload.avg_memory / 1024 / 1024).toFixed(1)}MB avg</span>
      </div>
    </div>
  );
}
