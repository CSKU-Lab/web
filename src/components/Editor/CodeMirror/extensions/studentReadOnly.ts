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

    let blocked = false;
    tr.changes.iterChangedRanges((fromA, toA) => {
      if (ranges.some((r) => fromA < r.to && toA > r.from)) {
        blocked = true;
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
