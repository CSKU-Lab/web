import type { CodeFile, FileSegment, TemplateFile } from "~/components/Editor/types/editor";
import type { SubmittedFile, SubmittedFileSegment } from "~/features/core/submissions/types/core-code-submission";

/**
 * Convert a TemplateFile to a CodeFile for display in the student editor.
 * Visible content = editable + readonly + exclude (not hidden).
 * Carries segments so CodeEditor can enforce readonly ranges by position.
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
 * Given the current flat editor content and the original segments,
 * extract the contents of editable segments.
 * Non-editable segments are assumed to remain unchanged (readonly lock).
 */
function extractEditableContents(
  currentContent: string,
  segments: FileSegment[],
): { index: number; content: string }[] {
  const result: SubmittedFileSegment[] = [];
  let pos = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.type === "hidden") continue;

    if (seg.type === "editable") {
      // Find the next non-editable visible segment to bound this one.
      const nextFixed = segments
        .slice(i + 1)
        .find((s) => s.type !== "hidden" && s.type !== "editable");

      let editableContent: string;
      if (nextFixed) {
        const fixedPos = currentContent.indexOf(nextFixed.content, pos);
        if (fixedPos !== -1) {
          editableContent = currentContent.slice(pos, fixedPos);
          pos = fixedPos;
        } else {
          editableContent = currentContent.slice(pos);
          pos = currentContent.length;
        }
      } else {
        editableContent = currentContent.slice(pos);
        pos = currentContent.length;
      }

      result.push({ index: i, content: editableContent });
    } else {
      // readonly or exclude: advance position by their fixed content length.
      pos += seg.content.length;
    }
  }

  return result;
}

/**
 * Build SubmittedFile[] from the original TemplateFile[] and the current
 * CodeFile[] (flat editor content). Used to compose the submission payload.
 */
export function buildSubmittedFiles(
  templateFiles: TemplateFile[],
  currentFiles: CodeFile[],
): SubmittedFile[] {
  return templateFiles.map((tf) => {
    const currentFile = currentFiles.find((f) => f.name === tf.name);
    const currentContent = currentFile?.content ?? "";

    if (tf.segments.length === 0) {
      // Backward compat: no segments — send full content as index 0.
      return {
        name: tf.name,
        editable_segments: [{ index: 0, content: currentContent }],
      };
    }

    const editableSegments = extractEditableContents(currentContent, tf.segments);
    return { name: tf.name, editable_segments: editableSegments };
  });
}
