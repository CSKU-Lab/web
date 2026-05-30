"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAtom } from "jotai";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { MaterialType } from "~/types/cms-material";
import {
  fuzzySearchOpenAtom,
  fuzzySearchQueryAtom,
} from "~/features/cms/submissions/stores/fuzzy-search.store";
import { useFuzzySearch } from "~/features/cms/submissions/hooks/useFuzzySearch";
import { SearchInput } from "~/features/cms/submissions/components/fuzzy-search/SearchInput";
import { ResultCard } from "~/features/cms/submissions/components/fuzzy-search/ResultCard";
import { CMSSectionStudentLatestSubmission } from "~/types/cms-section-submission";

interface FuzzySearchPanelProps {
  students: CMSSectionStudentLatestSubmission[];
  materialType?: MaterialType;
}

export function FuzzySearchPanel({
  students,
  materialType = MaterialType.CODE,
}: FuzzySearchPanelProps) {
  const [isOpen, setIsOpen] = useAtom(fuzzySearchOpenAtom);
  const [query, setQuery] = useAtom(fuzzySearchQueryAtom);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useFuzzySearch({ students, query });

  // Handle dialog open/close — reset query and selection on close
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setQuery("");
        setSelectedIndex(0);
      }
      setIsOpen(open);
    },
    [setIsOpen, setQuery],
  );

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation inside the panel
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Escape":
          e.preventDefault();
          handleOpenChange(false);
          break;
      }
    },
    [isOpen, results.length, handleOpenChange],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected card into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const el = resultsRef.current.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  // Global Cmd/Ctrl+F shortcut to open
  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", onGlobalKey);
    return () => document.removeEventListener("keydown", onGlobalKey);
  }, [setIsOpen]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        {/* Custom overlay: backdrop-blur + semi-transparent */}
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-md bg-black/30" />

        {/* Full-screen content container — no panel background */}
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 flex flex-col items-center overflow-y-auto px-6 pt-[20vh] pb-10 duration-200"
        >
          <DialogPrimitive.Title className="sr-only">
            Fuzzy Search Submissions
          </DialogPrimitive.Title>

          {/* Input + kbd hints — fixed width, sits at ~20% from top */}
          <div className="w-full max-w-2xl shrink-0">
            <SearchInput
              query={query}
              onChange={handleQueryChange}
              onClear={() => handleQueryChange("")}
              resultCount={results.length}
              inputRef={inputRef}
            />
          </div>

          {/* Results — same width, cards have their own white bg */}
          <div ref={resultsRef} className="w-full max-w-2xl mt-4 space-y-3">
            {results.length === 0 && query ? (
              <div className="py-10">
                <NoDataAvailable />
              </div>
            ) : (
              results.map((result, index) => (
                <ResultCard
                  key={result.item.student.id}
                  submission={result.item}
                  materialType={materialType}
                  matches={result.matches}
                  isSelected={index === selectedIndex}
                />
              ))
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
