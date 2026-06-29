import { EditorState, StateField, type Extension } from "@codemirror/state";
import type { FileSegment } from "~/components/Editor/types/editor";

interface Range {
  from: number;
  to: number;
}

export interface StudentReadOnlyResult {
  extension: Extension;
  /**
   * The StateField tracking current readonly range positions.
   * Positions auto-adjust via mapPos as the user edits allowed regions.
   * Expose this so callers (e.g. CodeEditor) can read current positions
   * to extract editable segment contents without fragile indexOf searches.
   */
  rangesField: StateField<Range[]>;
}

/**
 * Creates a CodeMirror extension that enforces readonly ranges for non-editable
 * segments in the student editor.
 *
 * Uses StateField (auto-adjusts positions via mapPos as user edits allowed regions)
 * + EditorState.transactionFilter (blocks any change that touches a readonly range).
 * Does NOT use the readOnlyRangeExtension package — avoids duplicate StateField
 * conflict with the one already installed in CodeMirror/index.tsx.
 */
export function createStudentReadOnlyExtension(segments: FileSegment[]): StudentReadOnlyResult {
  const initialRanges: Range[] = [];
  let pos = 0;
  for (const seg of segments) {
    if (seg.type === "hidden") continue;
    const end = pos + seg.content.length;
    if (seg.type !== "editable") {
      initialRanges.push({ from: pos, to: end });
    }
    pos = end;
  }

  // If the last visible segment is non-editable, block insertions at end-of-doc.
  // Without this, students could append new lines after the last readonly line.
  const lastVisibleSegment = [...segments].reverse().find((s) => s.type !== "hidden");
  const blockAppendAtEnd = lastVisibleSegment !== undefined && lastVisibleSegment.type !== "editable";

  const rangesField = StateField.define<Range[]>({
    create() {
      return initialRanges;
    },
    update(ranges, tr) {
      if (!tr.docChanged) return ranges;
      return ranges.map((r) => ({
        from: tr.changes.mapPos(r.from, 1),
        to: tr.changes.mapPos(r.to, -1),
      }));
    },
  });

  // Block any transaction whose change set overlaps a readonly range.
  const readonlyFilter = EditorState.transactionFilter.of((tr) => {
    if (!tr.docChanged) return tr;
    const ranges = tr.startState.field(rangesField, false);
    if (!ranges || ranges.length === 0) return tr;

    const docLength = tr.startState.doc.length;
    let blocked = false;
    tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
      if (ranges.some((r) => fromA < r.to && toA > r.from)) {
        blocked = true;
      }
      if (blockAppendAtEnd && fromA >= docLength) {
        blocked = true;
      }
      // Block pressing Enter at the end of a fully-readonly line. When an author
      // marks a whole line readonly but leaves its trailing "\n" in the next
      // (editable) segment, the readonly range ends exactly at line-end, so a
      // newline inserted there sits on the boundary (fromA === r.to) and slips
      // past the overlap check above — letting the student append a blank line
      // to the readonly line. Catch that pure-insert-of-newline case here.
      if (inserted.lines > 1 && fromA === toA) {
        const lineEnd = tr.startState.doc.lineAt(fromA).to;
        if (fromA === lineEnd && ranges.some((r) => r.to === fromA)) {
          blocked = true;
        }
      }
    });
    return blocked ? [] : tr;
  });

  if (initialRanges.length === 0) {
    // No non-editable segments — still return rangesField so callers can read
    // an empty array without needing a null check.
    return { extension: [rangesField], rangesField };
  }

  return { extension: [rangesField, readonlyFilter], rangesField };
}
