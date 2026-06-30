import { useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from "react";
import { generateId } from "~/utils/generate-id";
import { FileCode, PanelLeftOpen, RotateCcw } from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import FileTree from "./FileTree";
import RunnerSelect from "./RunnerSelect";
import { useEditorSettings } from "~/globalStore/settings";
import type { Runner } from "./types/runner";
import Playground, { type PlaygroundHandle } from "./Playground";
import { EditorView } from "@codemirror/view";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import type { CodeFile, FileSegment } from "./types/editor";
import { useDebouncedCallback } from "~/hooks/useDebouncedCallback";
import { createStudentReadOnlyExtension } from "./CodeMirror/extensions/studentReadOnly";
import { createSegmentMarksExtension } from "./CodeMirror/extensions/segmentMarks";
import { api } from "~/lib/api.client";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MarkdownRenderer from "~/components/ui/markdown-renderer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { Button } from "~/components/commons/Button";

interface Permission {
  modifyFiles?: boolean;
  writeFiles?: boolean;
  codeExecution?: boolean;
  selectRunner?: boolean;
}

interface Props {
  files: CodeFile[];
  onFilesChange: (files: CodeFile[]) => void;
  permissions?: Permission;
  allowedRunners: Runner[];
  initialSelectedRunner?: Runner | null;
  onChangeSelectedRunner?: (runner: Runner) => void;
  isLoading?: boolean;
  queryFn?: (query: string) => Promise<Runner[]>;
  isReadonlyFile?: (name: string) => boolean;
  isRequiredFile?: (name: string) => boolean;
  /** Allow deleting a specific file even when file modification is disabled */
  canDeleteFile?: (name: string) => boolean;
  /** Optional element rendered immediately after the RunnerSelect dropdown */
  runnerSelectAddon?: ReactNode;
  /**
   * When provided, renders a "restart from template" button in the toolbar.
   * Caller resets the editor files back to the selected runner's template.
   */
  onRestart?: () => void;
  /** Paint readonly/exclude segment highlights (as in the Runners tab). Off by default. */
  showSegmentMarks?: boolean;
  /**
   * Bump to force a full editor rebuild when `files` is replaced wholesale
   * (e.g. "Use This Code", runner switch) rather than edited via typing.
   * Remounts CodeMirror and rebuilds the readonly/segment extensions so their
   * ranges align to the new content. Leave undefined for callers that only edit.
   */
  resetKey?: number;
}

/**
 * Given current flat content, readonly range positions (from rangesField),
 * and the original segments array, return segments with editable contents
 * updated to what the student has currently typed.
 */
function syncEditableSegments(
  content: string,
  readonlyRanges: { from: number; to: number }[],
  originalSegments: FileSegment[],
): FileSegment[] {
  // Build editable regions as gaps between sorted readonly ranges.
  const sorted = [...readonlyRanges].sort((a, b) => a.from - b.from);
  const editableRegions: { from: number; to: number }[] = [];
  let pos = 0;
  for (const r of sorted) {
    if (r.from > pos) editableRegions.push({ from: pos, to: r.from });
    pos = r.to;
  }
  if (pos < content.length) editableRegions.push({ from: pos, to: content.length });

  // Walk original segments (including hidden), assign editable content by slot.
  let slot = 0;
  return originalSegments.map((seg) => {
    if (seg.type !== "editable") return seg;
    const region = editableRegions[slot++];
    if (!region) return seg;
    return { ...seg, content: content.slice(region.from, region.to) };
  });
}

function CodeEditor({
  files,
  onFilesChange,
  permissions,
  allowedRunners,
  initialSelectedRunner,
  onChangeSelectedRunner,
  isLoading,
  queryFn,
  isReadonlyFile,
  isRequiredFile,
  canDeleteFile,
  runnerSelectAddon,
  onRestart,
  showSegmentMarks = false,
  resetKey = 0,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [settings] = useEditorSettings();
  const [runnerSelectError, setRunnerSelectError] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [mdTab, setMdTab] = useState("edit");
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(true);
  const [isRestartOpen, setIsRestartOpen] = useState(false);

  const [previousFiles, setPreviousFiles] = useState<CodeFile[]>([]);
  if (previousFiles.length === 0 && files.length > 0) {
    setSelectedFile(files[0].name);
    setPreviousFiles(files);
  }

  const [sessionId] = useState<string>(() => generateId());
  const [lspToken, setLspToken] = useState<string | null>(null);
  const playgroundRef = useRef<PlaygroundHandle>(null);

  // Stable refs so closures inside memoized extensions always see latest values.
  const currentFileRef = useRef<CodeFile | undefined>(undefined);
  const filesRef = useRef<CodeFile[]>(files);
  filesRef.current = files;

  const editorRunKeymap = useMemo(
    () =>
      Prec.highest(
        keymap.of([
          {
            key: "Ctrl-Enter",
            mac: "Cmd-Enter",
            run: () => {
              playgroundRef.current?.run();
              return true;
            },
          },
        ]),
      ),
    [],
  );

  useEffect(() => {
    api
      .get<{ token: string }>("/api/v1/lsp/token")
      .then((res) => setLspToken(res.data.token))
      .catch(() => {
        // LSP service unavailable — editor works without it
      });
  }, []);

  if (initialSelectedRunner && selectedRunner === null) {
    setSelectedRunner(initialSelectedRunner);
  }

  const handleSelectFile = (name: string) => {
    setSelectedFile(name);
  };

  const currentFile = files.find((f) => f.name === selectedFile);
  currentFileRef.current = currentFile;

  const fileExtension = currentFile?.name.split(".").pop();

  const handleSelectRunner = (runner: Runner) => {
    setSelectedRunner(runner);
    onChangeSelectedRunner?.(runner);
    setRunnerSelectError(false);
  };

  const debouncedOnFilesChange = useDebouncedCallback(
    (newFiles: CodeFile[]) => {
      onFilesChange(newFiles);
    },
    100,
  );

  // For plain files (no segments): update content from onChange.
  const handleCodeChange = useCallback(
    (value: string) => {
      const cf = currentFileRef.current;
      if (!cf || cf.segments) return; // segmented files handled by updateListener
      const newFiles = filesRef.current.map((f) =>
        f.name === cf.name ? { ...f, content: value } : f,
      );
      debouncedOnFilesChange(newFiles);
    },
    [debouncedOnFilesChange],
  );

  // Per-file readonly extension — recreated only when filename changes (segments are stable).
  // Rebuild on filename change AND on resetKey bump (wholesale file replacement).
  // NOT on currentFile.segments identity — that changes on every keystroke
  // (syncEditableSegments returns a new array), which would reset the StateField
  // mid-typing. resetKey only bumps on external replace, so editing is unaffected.
  const readOnlyResult = useMemo(
    () =>
      currentFile?.segments
        ? createStudentReadOnlyExtension(currentFile.segments)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFile?.name, resetKey],
  );

  // Update listener: when doc changes, recompute editable segment contents using
  // actual range positions (no indexOf) and propagate up via onFilesChange.
  const segmentUpdateListener = useMemo(() => {
    if (!readOnlyResult) return [];
    const { rangesField } = readOnlyResult;
    return [
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return;
        const cf = currentFileRef.current;
        if (!cf?.segments) return;

        const content = update.state.doc.toString();
        const ranges = update.state.field(rangesField, false) ?? [];
        const updatedSegments = syncEditableSegments(content, ranges, cf.segments);
        const updatedFile: CodeFile = { ...cf, content, segments: updatedSegments };
        const newFiles = filesRef.current.map((f) =>
          f.name === cf.name ? updatedFile : f,
        );
        debouncedOnFilesChange(newFiles);
      }),
    ];
  }, [readOnlyResult, debouncedOnFilesChange]);

  const readOnlyExtensions = readOnlyResult ? [readOnlyResult.extension] : [];

  // Visual segment marks (readonly/exclude highlights) mirroring the Runners tab,
  // so authors can see segment regions in editors fed flattened files (e.g. Solution tab).
  const segmentMarksExtensions = useMemo(
    () =>
      showSegmentMarks && currentFile?.segments
        ? [createSegmentMarksExtension(currentFile.segments)]
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFile?.name, showSegmentMarks, resetKey],
  );

  // A single, fixed file has nothing to navigate or manage, so skip the file
  // tree entirely. Authors who can add files keep it even with one file.
  const showFileTree = files.length > 1 || (permissions?.modifyFiles ?? false);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex min-h-0">
        {showFileTree &&
          (isFileTreeCollapsed ? (
            <button
              onClick={() => setIsFileTreeCollapsed(false)}
              className="border-r flex flex-col items-center pt-2 px-1.5 hover:bg-(--gray-2) transition-colors text-(--gray-9) hover:text-(--gray-11)"
              title="Expand file tree"
            >
              <PanelLeftOpen size="1rem" />
            </button>
          ) : (
            <FileTree
              allowModify={permissions?.modifyFiles ?? false}
              files={files}
              selectedFile={selectedFile}
              onSelectFile={handleSelectFile}
              onChange={onFilesChange}
              isReadonlyFile={isReadonlyFile}
              isRequiredFile={isRequiredFile}
              canDeleteFile={canDeleteFile}
              onCollapse={() => setIsFileTreeCollapsed(true)}
            />
          ))}
        <Tabs
          value={mdTab}
          onValueChange={setMdTab}
          className="flex-1 min-h-0 flex flex-col min-w-40 gap-0"
        >
          <div className="border-b p-1 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <RunnerSelect
                runners={allowedRunners}
                selectedRunner={selectedRunner}
                onSelect={handleSelectRunner}
                isError={runnerSelectError}
                isLoading={isLoading}
                disabled={!permissions?.selectRunner}
                queryFn={queryFn}
              />
              {runnerSelectAddon}
            </div>
            <div className="flex items-center gap-2">
              {fileExtension === "md" && (
                <TabsList className="w-fit">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              )}
              {onRestart && (
                <Dialog open={isRestartOpen} onOpenChange={setIsRestartOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          disabled={isLoading || selectedRunner === null}
                          className="flex size-6 items-center justify-center rounded text-(--gray-10) hover:bg-(--gray-4) hover:text-(--gray-12) disabled:pointer-events-none disabled:opacity-50 transition-colors"
                        >
                          <RotateCcw size="1rem" />
                        </button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      Restart from template — discard your changes and reset the
                      code to the original template
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent>
                    <DialogHeader className="p-4">
                      <DialogTitle>Restart from template?</DialogTitle>
                    </DialogHeader>
                    <DialogBody className="px-4 py-2">
                      <DialogDescription className="text-(--gray-11)">
                        This discards your current changes and resets the code to
                        the original template. This cannot be undone.
                      </DialogDescription>
                    </DialogBody>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button
                        variant="danger"
                        onClick={() => {
                          onRestart();
                          setIsRestartOpen(false);
                        }}
                      >
                        Restart
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            {isLoading || currentFile === undefined ? (
              <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
                <FileCode size="3rem" className="mb-3 opacity-50" />
                <p className="text-sm">Click a file to start editing</p>
              </div>
            ) : fileExtension === "md" ? (
              mdTab === "edit" ? (
                <CodeMirror
                  key={`${currentFile.name}:${resetKey}`}
                  readOnly={
                    (permissions ? !permissions.writeFiles : true) ||
                    (currentFile.readonly ?? false)
                  }
                  className="h-full"
                  extension={fileExtension}
                  fontSize={settings.fontSize}
                  vimMode={settings.vimMode}
                  value={currentFile.content}
                  onChange={handleCodeChange}
                  sessionId={sessionId}
                  lspToken={lspToken}
                  extensions={[
                    editorRunKeymap,
                    ...readOnlyExtensions,
                    ...segmentMarksExtensions,
                    ...segmentUpdateListener,
                  ]}
                />
              ) : (
                <div className="p-4">
                  <MarkdownRenderer>{currentFile.content}</MarkdownRenderer>
                </div>
              )
            ) : (
              <CodeMirror
                key={`${currentFile.name}:${resetKey}`}
                readOnly={
                  (permissions ? !permissions.writeFiles : true) ||
                  (currentFile.readonly ?? false)
                }
                className="h-full"
                extension={fileExtension}
                fontSize={settings.fontSize}
                vimMode={settings.vimMode}
                value={currentFile.content}
                onChange={handleCodeChange}
                sessionId={sessionId}
                lspToken={lspToken}
                extensions={[
                  editorRunKeymap,
                  ...readOnlyExtensions,
                  ...segmentMarksExtensions,
                  ...segmentUpdateListener,
                ]}
              />
            )}
          </div>
        </Tabs>
      </div>

      <Playground
        ref={playgroundRef}
        files={files}
        runnerID={selectedRunner?.id ?? ""}
        onError={() => setRunnerSelectError(true)}
        disabled={!permissions?.codeExecution}
      />
    </div>
  );
}

export default CodeEditor;
