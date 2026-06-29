"use client";

import type { Editor } from "@tiptap/react";
import { cn } from "~/lib/utils";
import type { TocHeading } from "~/features/core/materials/utils/document-toc";

interface Props {
  headings: TocHeading[];
  editor: Editor | null;
}

/**
 * Table-of-contents index for a document material. Lists every heading and,
 * on click, scrolls the matching heading into view.
 *
 * Scroll targets are resolved from the live editor doc at click time: we walk
 * `editor.state.doc` for heading positions in document order, which is the same
 * order `extractHeadings` produced, so list index N maps to heading node N.
 */
function DocumentToc({ headings, editor }: Props) {
  if (headings.length === 0) return null;

  const scrollToHeading = (index: number) => {
    if (!editor) return;

    const positions: number[] = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        // Match extractHeadings: skip empty headings so list index N maps to
        // the Nth *non-empty* heading node here too.
        if (node.textContent.trim()) positions.push(pos);
        return false; // headings don't nest other headings
      }
      return true;
    });

    const pos = positions[index];
    if (pos === undefined) return;

    const dom = editor.view.nodeDOM(pos);
    if (dom instanceof HTMLElement) {
      dom.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Document outline"
      className="hidden xl:block w-56 shrink-0 sticky top-0 self-start max-h-screen overflow-auto p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        On this page
      </p>
      <ul className="space-y-1 border-l">
        {headings.map((heading, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => scrollToHeading(index)}
              style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
              className={cn(
                "block w-full text-left text-sm text-muted-foreground",
                "-ml-px border-l border-transparent py-0.5 pr-2",
                "hover:text-foreground hover:border-foreground transition-colors",
                "truncate",
              )}
              title={heading.text}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default DocumentToc;
