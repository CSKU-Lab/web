"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import ReactCodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { getLangFromExtension } from "~/components/Editor/CodeMirror/utils/getLang";
import { githubDarkInit, githubLightInit } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { indentUnit } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { createIndentWithTab } from "~/components/Editor/CodeMirror/extensions/indentWithTab";
import { useEditorSettings } from "~/globalStore/settings";
import {
  segmentMarksExtension,
  segmentRangesField,
  applySegmentEffect,
  clearSegmentEffect,
  getSegmentRanges,
  type SegmentRange,
} from "~/components/Editor/CodeMirror/extensions/segmentMarks";
import type { FileSegment, SegmentType, TemplateFile } from "~/components/Editor/types/editor";
import { normalizeHiddenSegments } from "~/components/Editor/utils/segments";
import { createStudentReadOnlyExtension } from "~/components/Editor/CodeMirror/extensions/studentReadOnly";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { X } from "lucide-react";

interface Props {
  file: TemplateFile;
  onChange: (file: TemplateFile) => void;
  extension?: string;
  fontSize?: number;
  disabled?: boolean;
}

const SEGMENT_TYPES: {
  type: SegmentType;
  label: string;
  description: string;
  dot: string;
  text: string;
  hover: string;
}[] = [
  {
    type: "readonly",
    label: "Readonly",
    description: "Student can see but not edit",
    dot: "#3b82f6",
    text: "text-blue-600 dark:text-blue-400",
    hover: "hover:bg-blue-50 dark:hover:bg-blue-950/40",
  },
  {
    type: "hidden",
    label: "Hidden",
    description: "Not shown to student at all",
    dot: "#7c3aed",
    text: "text-violet-600 dark:text-violet-400",
    hover: "hover:bg-violet-50 dark:hover:bg-violet-950/40",
  },
  {
    type: "exclude",
    label: "Exclude",
    description: "Visible but not sent to grader",
    dot: "#f97316",
    text: "text-orange-600 dark:text-orange-400",
    hover: "hover:bg-orange-50 dark:hover:bg-orange-950/40",
  },
];

function segmentsToContent(segments: FileSegment[]): string {
  return segments.map((s) => s.content).join("");
}

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

  // Fold each hidden line's trailing newline into its hidden segment so the
  // student view collapses the line instead of leaving an orphan blank line.
  return normalizeHiddenSegments(segments.filter((s) => s.content.length > 0));
}

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

function studentContent(segments: FileSegment[]): string {
  return segments
    .filter((s) => s.type !== "hidden")
    .map((s) => s.content)
    .join("");
}

function SegmentedFileEditor({ file, onChange, extension, fontSize = 14, disabled = false }: Props) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [tab, setTab] = useState("edit");
  const { resolvedTheme } = useTheme();
  const [{ indentSize }] = useEditorSettings();

  const indentExtensions = useMemo(
    () => [
      indentUnit.of(" ".repeat(indentSize)),
      EditorState.tabSize.of(indentSize),
      createIndentWithTab(indentSize),
    ],
    [indentSize],
  );

  const initialContent = useMemo(() => segmentsToContent(file.segments), []);

  // Keep a stable ref to the latest onChange so debouncedOnChange never recreates.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedOnChange = useCallback((newFile: TemplateFile) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onChangeRef.current(newFile);
    }, 150);
  }, []);

  const getView = (): EditorView | null => editorRef.current?.view ?? null;

  const handleChange = useCallback(
    (value: string) => {
      const view = getView();
      if (!view) return;
      const ranges = getSegmentRanges(view.state);
      const segments = buildSegmentsFromDecors(value, ranges);
      debouncedOnChange({ name: file.name, segments });
    },
    [file.name, debouncedOnChange],
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const applyType = (type: SegmentType | null) => {
    const view = getView();
    if (!view) return;
    const { from, to } = view.state.selection.main;
    if (from === to) return;

    // Note: hidden lines have their trailing newline folded in by
    // normalizeHiddenSegments (in buildSegmentsFromDecors), regardless of how
    // the selection ends — so no selection-dependent newline handling here.
    if (type === null) {
      view.dispatch({ effects: clearSegmentEffect.of({ from, to }) });
    } else {
      view.dispatch({ effects: applySegmentEffect.of({ from, to, type }) });
    }

    const value = view.state.doc.toString();
    const ranges = getSegmentRanges(view.state);
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

  const editExtensions = useMemo(
    () => [
      basicSetup,
      customTheme,
      ...(langExtension ? [langExtension] : []),
      segmentMarksExtension,
      selectionChangeExtension,
      ...indentExtensions,
    ],
    [customTheme, langExtension, selectionChangeExtension, indentExtensions],
  );

  const previewContent = useMemo(() => studentContent(file.segments), [file.segments]);

  // Key that changes when segment structure changes — resets the preview editor.
  const previewKey = useMemo(
    () => file.segments.map((s) => `${s.type}:${s.content.length}`).join(","),
    [file.segments],
  );

  // Student readonly extension for preview — enforces marks without making
  // the whole editor readonly so the creator can test editing the editable parts.
  const previewReadOnlyExtension = useMemo(
    () => createStudentReadOnlyExtension(file.segments).extension,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [previewKey],
  );

  const previewExtensions = useMemo(
    () => [
      basicSetup,
      customTheme,
      ...(langExtension ? [langExtension] : []),
      previewReadOnlyExtension,
      ...indentExtensions,
    ],
    [customTheme, langExtension, previewReadOnlyExtension, indentExtensions],
  );

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex flex-col h-full gap-0"
    >
      {/* Single header row: tabs left, mark controls right */}
      <div className="flex items-center gap-3 border-b px-2 h-10 shrink-0">
        <TabsList className="h-7">
          <TabsTrigger value="edit" className="h-6 px-3 text-xs">
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="h-6 px-3 text-xs">
            Preview
          </TabsTrigger>
        </TabsList>

        {tab === "edit" && (
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center gap-0.5 ml-auto">
              {SEGMENT_TYPES.map(({ type, label, description, dot, text, hover }) => (
                <Tooltip key={type}>
                  <TooltipTrigger asChild>
                    <button
                      disabled={disabled || !hasSelection}
                      onClick={() => applyType(type)}
                      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${text} ${hover}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: dot }}
                      />
                      {label}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground">{description}</p>
                    {!hasSelection && (
                      <p className="mt-0.5 opacity-60">Select text first</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}

              <div className="w-px h-4 bg-border mx-1.5" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled={disabled || !hasSelection}
                    onClick={() => applyType(null)}
                    className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Remove mark from selection</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}
      </div>

      {/* Editor — forceMount keeps the CodeMirror instance alive while on preview
          tab so segment decorations (hidden/readonly/exclude marks) are not lost. */}
      <TabsContent forceMount value="edit" className="flex-1 min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden">
        <ReactCodeMirror
          ref={editorRef}
          value={initialContent}
          onChange={handleChange}
          onCreateEditor={handleCreateEditor}
          readOnly={disabled}
          extensions={editExtensions}
          theme={resolvedTheme === "light" ? lightTheme : darkTheme}
          style={{ height: "100%" }}
        />
      </TabsContent>

      {/* Student preview — interactive, same behaviour as the student editor */}
      <TabsContent value="preview" className="flex-1 min-h-0 mt-0 overflow-hidden">
        <ReactCodeMirror
          key={previewKey}
          value={previewContent}
          extensions={previewExtensions}
          theme={resolvedTheme === "light" ? lightTheme : darkTheme}
          style={{ height: "100%" }}
        />
      </TabsContent>
    </Tabs>
  );
}

export default SegmentedFileEditor;
