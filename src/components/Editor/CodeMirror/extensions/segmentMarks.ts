"use client";
import {
  StateEffect,
  StateField,
  type Extension,
  type EditorState,
  type Range,
} from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import type { FileSegment, SegmentType } from "~/components/Editor/types/editor";

export interface SegmentRange {
  from: number;
  to: number;
  type: SegmentType;
}

export const applySegmentEffect = StateEffect.define<SegmentRange>();
export const clearSegmentEffect = StateEffect.define<{ from: number; to: number }>();

/** Stores raw segment ranges; auto-maps positions on document changes. */
export const segmentRangesField = StateField.define<SegmentRange[]>({
  create() {
    return [];
  },
  update(ranges, tr) {
    let next = ranges;

    if (tr.docChanged) {
      next = next.map((r) => ({
        ...r,
        from: tr.changes.mapPos(r.from, 1),
        to: tr.changes.mapPos(r.to, -1),
      }));
    }

    for (const effect of tr.effects) {
      if (effect.is(clearSegmentEffect)) {
        const { from, to } = effect.value;
        next = next.filter((r) => r.to <= from || r.from >= to);
      } else if (effect.is(applySegmentEffect)) {
        const { from, to, type } = effect.value;
        // Remove all ranges intersecting [from, to], then add the new one.
        next = next.filter((r) => r.to <= from || r.from >= to);
        if (from < to) next = [...next, { from, to, type }];
      }
    }

    return next;
  },
});

const segmentTheme = EditorView.baseTheme({
  // Underline mark (exact sub-line range).
  ".cm-segment-bg-readonly": {
    textDecoration: "underline solid var(--blue-9, #1d6fa4)",
    textDecorationThickness: "2px",
  },
  ".cm-segment-bg-hidden": {
    textDecoration: "underline wavy var(--violet-9, #6e3fbd)",
    textDecorationThickness: "2px",
  },
  ".cm-segment-bg-exclude": {
    textDecoration: "underline dashed var(--orange-9, #c4611a)",
    textDecorationThickness: "2px",
  },
  // Border-left per line.
  ".cm-line.cm-segment-line-readonly": { borderLeft: "3px solid var(--blue-9,  #1d6fa4)" },
  ".cm-line.cm-segment-line-hidden":   { borderLeft: "3px solid var(--violet-9, #6e3fbd)" },
  ".cm-line.cm-segment-line-exclude":  { borderLeft: "3px solid var(--orange-9, #c4611a)" },
});

function buildMarkDecorations(
  field: StateField<SegmentRange[]>,
  state: EditorState,
): DecorationSet {
  const ranges = state.field(field, false) ?? [];
  const decos: Range<Decoration>[] = [];
  for (const r of ranges) {
    if (r.from >= r.to) continue;
    decos.push(Decoration.mark({ class: `cm-segment-bg-${r.type}` }).range(r.from, r.to));
  }
  return decos.length > 0
    ? Decoration.set(decos.sort((a, b) => a.from - b.from || a.to - b.to))
    : Decoration.none;
}

function buildLineDecorations(
  field: StateField<SegmentRange[]>,
  state: EditorState,
): DecorationSet {
  const ranges = state.field(field, false) ?? [];
  // Deduplicate: one decoration per line position (first type wins).
  const lineTypeMap = new Map<number, SegmentType>();
  for (const r of ranges) {
    if (r.from >= r.to) continue;
    const fromLine = state.doc.lineAt(r.from).number;
    const endPos = Math.max(
      r.from,
      Math.min(r.to - 1, state.doc.length > 0 ? state.doc.length - 1 : 0),
    );
    const toLine = state.doc.lineAt(endPos).number;
    for (let lineNum = fromLine; lineNum <= toLine; lineNum++) {
      const line = state.doc.line(lineNum);
      if (!lineTypeMap.has(line.from)) lineTypeMap.set(line.from, r.type);
    }
  }
  const decos: Range<Decoration>[] = [...lineTypeMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([pos, type]) => Decoration.line({ class: `cm-segment-line-${type}` }).range(pos));
  return decos.length > 0 ? Decoration.set(decos) : Decoration.none;
}

function makeSegmentPlugin(
  field: StateField<SegmentRange[]>,
  build: (field: StateField<SegmentRange[]>, state: EditorState) => DecorationSet,
) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = build(field, view.state);
      }
      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.startState.field(field) !== update.state.field(field)
        ) {
          this.decorations = build(field, update.state);
        }
      }
    },
    { decorations: (v) => v.decorations },
  );
}

const segmentBgDecorator = makeSegmentPlugin(segmentRangesField, buildMarkDecorations);
const segmentBorderDecorator = makeSegmentPlugin(segmentRangesField, buildLineDecorations);

/** Read current segment ranges, sorted by position. */
export function getSegmentRanges(state: EditorState): SegmentRange[] {
  return [...(state.field(segmentRangesField, false) ?? [])].sort(
    (a, b) => a.from - b.from,
  );
}

export const segmentMarksExtension: Extension = [
  segmentRangesField,
  segmentBgDecorator,
  segmentBorderDecorator,
  segmentTheme,
];

/**
 * Read-only visual segment marks seeded directly from a file's segments —
 * same colored decorations as {@link segmentMarksExtension} but without the
 * effect-driven editing API. Positions are derived in visible-content
 * coordinates (hidden segments are absent from the rendered content) and
 * auto-map as the doc is edited. Use this to surface readonly/exclude regions
 * in editors that consume flattened files (e.g. the CMS Solution tab).
 */
export function createSegmentMarksExtension(segments: FileSegment[]): Extension {
  const initial: SegmentRange[] = [];
  let pos = 0;
  for (const seg of segments) {
    if (seg.type === "hidden") continue; // not present in visible content
    const end = pos + seg.content.length;
    if (seg.type !== "editable") initial.push({ from: pos, to: end, type: seg.type });
    pos = end;
  }

  const field = StateField.define<SegmentRange[]>({
    create() {
      return initial;
    },
    update(ranges, tr) {
      if (!tr.docChanged) return ranges;
      return ranges.map((r) => ({
        ...r,
        from: tr.changes.mapPos(r.from, 1),
        to: tr.changes.mapPos(r.to, -1),
      }));
    },
  });

  return [
    field,
    makeSegmentPlugin(field, buildMarkDecorations),
    makeSegmentPlugin(field, buildLineDecorations),
    segmentTheme,
  ];
}
