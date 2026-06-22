"use client";
import {
  StateEffect,
  StateField,
  type Extension,
} from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import type { SegmentType } from "~/components/Editor/types/editor";

export interface SegmentRange {
  from: number;
  to: number;
  type: SegmentType;
}

export const applySegmentEffect = StateEffect.define<SegmentRange>();
export const clearSegmentEffect = StateEffect.define<{ from: number; to: number }>();

const segmentTheme = EditorView.baseTheme({
  ".cm-segment-readonly": {
    borderLeft: "3px solid var(--blue-9)",
    background: "rgba(0, 112, 210, 0.07)",
  },
  ".cm-segment-hidden": {
    background: "var(--gray-4)",
    opacity: "0.6",
  },
  ".cm-segment-exclude": {
    borderLeft: "3px solid var(--orange-9)",
    background: "rgba(255, 140, 0, 0.07)",
  },
});

const decorationForType = (type: SegmentType) =>
  Decoration.mark({ class: `cm-segment-${type}`, type });

export const segmentMarksField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);

    for (const effect of tr.effects) {
      if (effect.is(clearSegmentEffect)) {
        const { from, to } = effect.value;
        decorations = decorations.update({
          filterFrom: from,
          filterTo: to,
          filter: () => false,
        });
      } else if (effect.is(applySegmentEffect)) {
        const { from, to, type } = effect.value;
        // Clear existing marks in range first, then add new one.
        decorations = decorations.update({
          filterFrom: from,
          filterTo: to,
          filter: () => false,
          add: from < to ? [decorationForType(type).range(from, to)] : [],
        });
      }
    }

    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

/** Read current segment marks as SegmentRange[]. Sorted by position. */
export function getSegmentRanges(decorations: DecorationSet): SegmentRange[] {
  const ranges: SegmentRange[] = [];
  const cursor = decorations.iter();
  while (cursor.value !== null) {
    const type = (cursor.value.spec as { type: SegmentType }).type;
    ranges.push({ from: cursor.from, to: cursor.to, type });
    cursor.next();
  }
  return ranges;
}

export const segmentMarksExtension: Extension = [
  segmentMarksField,
  segmentTheme,
];
