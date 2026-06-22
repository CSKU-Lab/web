"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import ReactCodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { getLangFromExtension } from "~/components/Editor/CodeMirror/utils/getLang";
import { githubDarkInit, githubLightInit } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { indentWithTab } from "~/components/Editor/CodeMirror/extensions/indentWithTab";
import {
  segmentMarksExtension,
  segmentMarksField,
  applySegmentEffect,
  clearSegmentEffect,
  getSegmentRanges,
  type SegmentRange,
} from "~/components/Editor/CodeMirror/extensions/segmentMarks";
import type { FileSegment, SegmentType, TemplateFile } from "~/components/Editor/types/editor";
import { useDebouncedCallback } from "~/hooks/useDebouncedCallback";
import CodeMirror from "~/components/Editor/CodeMirror";

interface Props {
  file: TemplateFile;
  onChange: (file: TemplateFile) => void;
  extension?: string;
  fontSize?: number;
  disabled?: boolean;
}

const TOOLBAR_TYPES: { type: SegmentType; label: string; color: string }[] = [
  { type: "readonly", label: "Readonly", color: "text-blue-600 border-blue-400 hover:bg-blue-50" },
  { type: "hidden", label: "Hidden", color: "text-gray-600 border-gray-400 hover:bg-gray-100" },
  { type: "exclude", label: "Exclude", color: "text-orange-600 border-orange-400 hover:bg-orange-50" },
];

/** Derive full text content from segments (for initialization). */
function segmentsToContent(segments: FileSegment[]): string {
  return segments.map((s) => s.content).join("");
}

/** Build FileSegment[] from current editor content + decoration ranges. */
function buildSegmentsFromDecors(content: string, ranges: SegmentRange[]): FileSegment[] {
  if (ranges.length === 0) return [{ type: "editable", content }];

  const sorted = [...ranges].sort((a, b) => a.from - b.from);
  const segments: FileSegment[] = [];
  let pos = 0;

  for (const r of sorted) {
    if (r.from > pos) {
      segments.push({ type: "editable", content: content.slice(pos, r.from) });
    }
    segments.push({ type: r.type, content: content.slice(r.from, r.to) });
    pos = r.to;
  }

  if (pos < content.length) {
    segments.push({ type: "editable", content: content.slice(pos) });
  }

  return segments.filter((s) => s.content.length > 0);
}

/** Initialize decoration ranges from FileSegment[]. */
function segmentsToRanges(segments: FileSegment[]): SegmentRange[] {
  const ranges: SegmentRange[] = [];
  let pos = 0;
  for (const seg of segments) {
    const end = pos + seg.content.length;
    if (seg.type !== "editable") {
      ranges.push({ from: pos, to: end, type: seg.type });
    }
    pos = end;
  }
  return ranges;
}

/** Compute student-visible content from segments. */
function studentContent(segments: FileSegment[]): string {
  return segments
    .filter((s) => s.type !== "hidden")
    .map((s) => s.content)
    .join("");
}

function SegmentedFileEditor({ file, onChange, extension, fontSize = 14, disabled = false }: Props) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const { resolvedTheme } = useTheme();

  const initialContent = useMemo(() => segmentsToContent(file.segments), []);

  const debouncedOnChange = useDebouncedCallback((newFile: TemplateFile) => {
    onChange(newFile);
  }, 150);

  const getView = (): EditorView | null =>
    editorRef.current?.view ?? null;

  const handleChange = useCallback(
    (value: string) => {
      const view = getView();
      if (!view) return;
      const decorations = view.state.field(segmentMarksField);
      const ranges = getSegmentRanges(decorations);
      const segments = buildSegmentsFromDecors(value, ranges);
      debouncedOnChange({ name: file.name, segments });
    },
    [file.name, debouncedOnChange],
  );

  // Called by ReactCodeMirror when the editor view is definitively created.
  const handleCreateEditor = useCallback(
    (view: EditorView) => {
      const initialRanges = segmentsToRanges(file.segments);
      if (initialRanges.length === 0) return;
      view.dispatch({
        effects: initialRanges.map((r) =>
          applySegmentEffect.of({ from: r.from, to: r.to, type: r.type }),
        ),
      });
    },
    // file.segments is stable at mount (keyed by file name); no dep needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const applyType = (type: SegmentType | null) => {
    const view = getView();
    if (!view) return;
    const { from, to } = view.state.selection.main;
    if (from === to) return;

    if (type === null) {
      view.dispatch({ effects: clearSegmentEffect.of({ from, to }) });
    } else {
      view.dispatch({ effects: applySegmentEffect.of({ from, to, type }) });
    }

    // Trigger onChange
    const value = view.state.doc.toString();
    const decorations = view.state.field(segmentMarksField);
    const ranges = getSegmentRanges(decorations);
    const segments = buildSegmentsFromDecors(value, ranges);
    onChange({ name: file.name, segments });
  };

  const selectionChangeExtension = useMemo(
    () =>
      EditorView.updateListener.of((update) => {
        if (update.selectionSet) {
          const { from, to } = update.state.selection.main;
          setHasSelection(from !== to);
        }
      }),
    [],
  );

  const customTheme = useMemo(
    () =>
      EditorView.theme({
        "&": { height: "100%", fontSize: `${fontSize}px` },
      }),
    [fontSize],
  );

  const langExtension = extension ? getLangFromExtension(extension) : null;

  const lightTheme = useMemo(
    () =>
      githubLightInit({
        settings: {
          background: "var(--gray-1)",
          caret: "var(--gray-12)",
          gutterBackground: "var(--gray-2)",
          selection: "#b3d4ff",
          lineHighlight: "rgba(0,0,0,0.04)",
        },
      }),
    [],
  );
  const darkTheme = useMemo(
    () =>
      githubDarkInit({
        settings: {
          background: "var(--gray-1)",
          caret: "var(--gray-11)",
          gutterBackground: "var(--gray-2)",
          selection: "var(--gray-4)",
          lineHighlight: "var(--gray-3)",
        },
      }),
    [],
  );

  const previewContent = useMemo(() => studentContent(file.segments), [file.segments]);

  return (
    <div className="flex h-full">
      {/* Left panel: segment editor */}
      <div className="flex-1 flex flex-col min-w-0 border-r">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1 border-b bg-(--gray-2) shrink-0">
          {TOOLBAR_TYPES.map(({ type, label, color }) => (
            <button
              key={type}
              disabled={disabled || !hasSelection}
              onClick={() => applyType(type)}
              className={`px-2 py-0.5 text-xs border rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${color}`}
            >
              {label}
            </button>
          ))}
          <button
            disabled={disabled || !hasSelection}
            onClick={() => applyType(null)}
            className="px-2 py-0.5 text-xs border rounded font-medium text-(--gray-11) border-(--gray-6) hover:bg-(--gray-3) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <span className="ml-2 text-xs text-(--gray-10)">Select text then click to mark region</span>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0 overflow-auto">
          <ReactCodeMirror
            ref={editorRef}
            value={initialContent}
            onChange={handleChange}
            onCreateEditor={handleCreateEditor}
            readOnly={disabled}
            extensions={[
              basicSetup,
              customTheme,
              ...(langExtension ? [langExtension] : []),
              segmentMarksExtension,
              selectionChangeExtension,
              indentWithTab,
            ]}
            theme={resolvedTheme === "light" ? lightTheme : darkTheme}
            style={{ height: "100%" }}
          />
        </div>
      </div>

      {/* Right panel: student preview */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-2 py-1 border-b bg-(--gray-2) shrink-0">
          <span className="text-xs font-medium text-(--gray-11)">Student Preview</span>
        </div>
        <div className="flex-1 min-h-0">
          <CodeMirror
            key={previewContent}
            value={previewContent}
            readOnly
            className="h-full"
            extension={extension}
            fontSize={fontSize}
          />
        </div>
      </div>
    </div>
  );
}

export default SegmentedFileEditor;
