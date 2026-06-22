import type { CodeFile, TemplateFile } from "~/components/Editor/types/editor";
import type { SubmittedFile } from "~/features/core/submissions/types/core-code-submission";

/**
 * Convert a TemplateFile to a CodeFile for display in the student editor.
 * Visible content = editable + readonly + exclude (not hidden).
 * Carries segments so CodeEditor can enforce readonly ranges by position
 * and keep editable segment contents in sync as the student types.
 */
export function templateFileToCodeFile(tf: TemplateFile): CodeFile {
  let content = "";
  for (const seg of tf.segments) {
    if (seg.type !== "hidden") content += seg.content;
  }

  const hasNonEditable = tf.segments.some(
    (s) => s.type !== "editable" && s.type !== "hidden",
  );

  return {
    name: tf.name,
    content,
    segments: hasNonEditable ? tf.segments : undefined,
  };
}

/**
 * Build SubmittedFile[] for the submission payload.
 *
 * When a file has segments, CodeEditor keeps the editable segment contents
 * current in submissionFilesAtom (via syncEditableSegments + rangesField).
 * We just read them directly — no indexOf needed.
 *
 * Files without segments (backward compat) use the full flat content.
 */
export function buildSubmittedFiles(
  templateFiles: TemplateFile[],
  currentFiles: CodeFile[],
): SubmittedFile[] {
  return templateFiles.map((tf) => {
    const currentFile = currentFiles.find((f) => f.name === tf.name);

    if (!currentFile?.segments || tf.segments.length === 0) {
      // Backward compat: no segments — send full content as index 0.
      return {
        name: tf.name,
        editable_segments: [{ index: 0, content: currentFile?.content ?? "" }],
      };
    }

    // Editable segment contents are kept up-to-date in the atom by CodeEditor.
    const editableSegments = currentFile.segments
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s.type === "editable")
      .map(({ s, i }) => ({ index: i, content: s.content }));

    return { name: tf.name, editable_segments: editableSegments };
  });
}
