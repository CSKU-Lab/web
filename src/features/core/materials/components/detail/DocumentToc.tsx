"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { cn } from "~/lib/utils";
import type { TocHeading } from "~/features/core/materials/utils/document-toc";

interface Props {
  headings: TocHeading[];
  editor: Editor | null;
  /** The scrolling container the headings live in (DocumentViewer root). */
  scrollContainer: React.RefObject<HTMLElement | null>;
}

/**
 * Table-of-contents index for a document material, rendered as a compact rail
 * of lines (one per heading, width encoding its level) so it doesn't eat the
 * content's horizontal space. Hovering a line reveals that section's label as a
 * flyout, and the line for the section currently scrolled into view is
 * highlighted (scrollspy).
 *
 * Heading DOM elements are resolved from the live editor doc: we walk
 * `editor.state.doc` for heading positions in document order — the same order
 * `extractHeadings` produced — so list index N maps to heading node N, with no
 * reliance on DOM tag order.
 */
function DocumentToc({ headings, editor, scrollContainer }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Resolve the non-empty heading DOM elements in document order, matching the
  // filter `extractHeadings` uses so indices line up with the rendered list.
  const getHeadingElements = useCallback((): HTMLElement[] => {
    if (!editor) return [];
    const positions: number[] = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        if (node.textContent.trim()) positions.push(pos);
        return false; // headings don't nest other headings
      }
      return true;
    });
    return positions
      .map((pos) => editor.view.nodeDOM(pos))
      .filter((dom): dom is HTMLElement => dom instanceof HTMLElement);
  }, [editor]);

  const scrollToHeading = (index: number) => {
    const el = getHeadingElements()[index];
    if (!el) return;
    setActiveIndex(index);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scrollspy: highlight the last heading whose top has passed an upper
  // threshold line of the scroll container; when scrolled to the very bottom,
  // force the last heading active (it may sit too low to ever reach the line).
  useEffect(() => {
    if (!editor || headings.length === 0) return;
    const root = scrollContainer.current;
    if (!root) return;

    let elements: HTMLElement[] = [];
    let raf = 0;

    const update = () => {
      if (elements.length === 0) return;
      // At the very bottom, the last sections can't scroll past the line.
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 2) {
        setActiveIndex(elements.length - 1);
        return;
      }
      const line = root.getBoundingClientRect().top + root.clientHeight * 0.25;
      let active = 0;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].getBoundingClientRect().top <= line) active = i;
        else break;
      }
      setActiveIndex(active);
    };

    const init = () => {
      elements = getHeadingElements();
      if (elements.length === 0) {
        // Editor content may not be rendered yet (set via microtask); retry.
        raf = requestAnimationFrame(init);
        return;
      }
      update();
    };

    init();
    root.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", update);
    };
  }, [editor, headings, scrollContainer, getHeadingElements]);

  if (headings.length === 0) return null;

  // Clamp so a stale index from a previous (longer) document never points past
  // the current heading list before the scroll handler re-runs.
  const safeActiveIndex = Math.min(activeIndex, headings.length - 1);

  return (
    <nav
      aria-label="Document outline"
      className="hidden xl:block w-7 shrink-0 sticky top-1/2 -translate-y-1/2 self-start max-h-screen py-4 z-20"
    >
      <ul className="flex flex-col gap-1.5">
        {headings.map((heading, index) => {
          const isActive = index === safeActiveIndex;
          // Deeper headings get shorter lines to convey hierarchy.
          const width = Math.max(16 - (heading.level - 1) * 3, 7);
          return (
            <li key={index} className="group/item relative flex justify-start pl-2">
              <button
                type="button"
                onClick={() => scrollToHeading(index)}
                aria-label={heading.text}
                className="flex items-center py-0.5"
              >
                <span
                  style={{ width: `${width}px` }}
                  className={cn(
                    "h-0.5 rounded-full transition-colors",
                    isActive
                      ? "bg-foreground"
                      : "bg-muted-foreground/30 group-hover/item:bg-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2",
                    "whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-sm shadow-md",
                    "opacity-0 transition-opacity group-hover/item:opacity-100",
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {heading.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default DocumentToc;
