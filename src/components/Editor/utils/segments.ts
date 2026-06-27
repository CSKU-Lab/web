import type { CodeFile, FileSegment, TemplateFile } from "~/components/Editor/types/editor";
import type { SubmittedFile } from "~/features/core/submissions/types/core-code-submission";

/**
 * Reconstruct a solution file's segment structure from its runner template.
 *
 * A saved solution stores only flat `content` (no segments). The segment
 * structure (which ranges are readonly/exclude/hidden) lives on the runner
 * template. The solution's flat content equals the template's visible content
 * (editable + readonly + exclude; hidden stripped) with the editable regions
 * filled in by the author. Fixed (readonly/exclude) and hidden segments keep
 * the template's content verbatim; editable segments take the author's content.
 *
 * Fixed segment contents act as anchors: we walk the template segments and
 * slice the solution content between anchors to recover each editable region.
 *
 * Returns null if the content can't be aligned to the template (e.g. the
 * template changed since the solution was saved) so callers can fall back to
 * plain content rather than render misaligned marks.
 */
/**
 * Fold each hidden segment's line-terminating newline into the hidden segment.
 *
 * When an author marks a whole line hidden without selecting its trailing
 * newline, the "\n" is left in the following editable segment. Stripping the
 * hidden content for the student view then leaves that orphan "\n" as a blank
 * line — which reveals where hidden code sits and fails to pull the next line
 * up. Moving the "\n" into the hidden segment makes the hidden line vanish
 * cleanly. Total flat content is unchanged, so grader assembly is unaffected.
 */
export function normalizeHiddenSegments(segments: FileSegment[]): FileSegment[] {
  const result: FileSegment[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const next = segments[i + 1];
    if (
      seg.type === "hidden" &&
      !seg.content.endsWith("\n") &&
      next?.type === "editable" &&
      next.content.startsWith("\n")
    ) {
      result.push({ ...seg, content: seg.content + "\n" });
      const rest = next.content.slice(1);
      if (rest.length > 0) result.push({ ...next, content: rest });
      i++; // consumed `next`
      continue;
    }
    result.push(seg);
  }
  return result;
}

export function reconstructSolutionSegments(
  templateSegments: FileSegment[],
  content: string,
): FileSegment[] | null {
  const result: FileSegment[] = [];
  let pos = 0;

  for (let i = 0; i < templateSegments.length; i++) {
    const seg = templateSegments[i];

    if (seg.type === "hidden") {
      // Hidden content is absent from the solution's flat content — keep as-is.
      result.push(seg);
      continue;
    }

    if (seg.type !== "editable") {
      // Fixed anchor — must appear verbatim at the current position.
      if (content.slice(pos, pos + seg.content.length) !== seg.content) {
        return null;
      }
      result.push(seg);
      pos += seg.content.length;
      continue;
    }

    // Editable region runs until the next fixed anchor (hidden segments skipped).
    let anchor: string | null = null;
    for (let j = i + 1; j < templateSegments.length; j++) {
      const t = templateSegments[j].type;
      if (t === "hidden") continue;
      if (t === "editable") return null; // adjacent editables are unexpected
      anchor = templateSegments[j].content;
      break;
    }

    if (anchor === null) {
      result.push({ type: "editable", content: content.slice(pos) });
      pos = content.length;
    } else {
      const idx = content.indexOf(anchor, pos);
      if (idx === -1) return null;
      result.push({ type: "editable", content: content.slice(pos, idx) });
      pos = idx;
    }
  }

  if (pos !== content.length) return null; // unexplained trailing content
  return result;
}

/**
 * Attach reconstructed segments to solution files using the matching runner
 * template, so the Solution tab can render readonly/exclude marks (and enforce
 * readonly ranges) on initial load. Files that can't be aligned, or have no
 * non-editable segments, keep their plain content unchanged.
 */
export function attachSolutionSegments(
  solutionFiles: CodeFile[],
  runnerTemplateFiles: TemplateFile[],
): CodeFile[] {
  return solutionFiles.map((file) => {
    const template = runnerTemplateFiles.find((t) => t.name === file.name);
    if (!template) return file;

    // Normalize first so the reconstructed segment structure (and therefore the
    // editable-segment indices read by buildSubmittedFiles) is identical to a
    // fresh load via templateFileToCodeFile. Without this, a hidden segment
    // followed by an editable that is exactly "\n" yields an extra empty editable
    // segment here that the normal flow collapses — shifting every later index.
    const templateSegments = normalizeHiddenSegments(template.segments);

    const hasNonEditable = templateSegments.some(
      (s) => s.type !== "editable" && s.type !== "hidden",
    );
    if (!hasNonEditable) return file;

    const segments = reconstructSolutionSegments(templateSegments, file.content);
    if (!segments) return file;

    return { ...file, segments };
  });
}

/**
 * Convert a TemplateFile to a CodeFile for display in the student editor.
 * Visible content = editable + readonly + exclude (not hidden).
 * Carries segments so CodeEditor can enforce readonly ranges by position
 * and keep editable segment contents in sync as the student types.
 */
export function templateFileToCodeFile(tf: TemplateFile): CodeFile {
  const segments = normalizeHiddenSegments(tf.segments);

  let content = "";
  for (const seg of segments) {
    if (seg.type !== "hidden") content += seg.content;
  }

  const hasNonEditable = segments.some(
    (s) => s.type !== "editable" && s.type !== "hidden",
  );

  return {
    name: tf.name,
    content,
    segments: hasNonEditable ? segments : undefined,
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
