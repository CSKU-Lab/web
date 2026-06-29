import type { JSONContent } from "@tiptap/react";

export interface TocHeading {
  /** Heading level (1–6), taken from the tiptap heading node's `level` attr. */
  level: number;
  /** Full visible text of the heading, concatenating all descendant text nodes. */
  text: string;
}

/** Concatenate every descendant text node of a tiptap node, in document order. */
function nodeText(node: JSONContent): string {
  if (typeof node.text === "string") return node.text;
  if (!node.content) return "";
  return node.content.map(nodeText).join("");
}

/**
 * Walk a tiptap document (recursing into every container node — blockquotes,
 * list items, table cells, …) and return every heading node in document order.
 *
 * The order here matches a `doc.descendants` walk of the same content, so the
 * Nth entry corresponds 1:1 to the Nth heading node in the live editor.
 */
export function extractHeadings(
  content: JSONContent | null | undefined,
): TocHeading[] {
  if (!content) return [];
  const headings: TocHeading[] = [];

  const visit = (node: JSONContent) => {
    if (node.type === "heading") {
      const text = nodeText(node).trim();
      if (text) {
        const level =
          typeof node.attrs?.level === "number" ? node.attrs.level : 1;
        headings.push({ level, text });
      }
      return; // headings don't nest other headings
    }
    node.content?.forEach(visit);
  };

  visit(content);
  return headings;
}
