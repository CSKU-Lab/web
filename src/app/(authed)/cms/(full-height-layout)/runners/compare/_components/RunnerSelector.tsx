"use client";

import { useAtom } from "jotai";
import { Terminal, ChevronDown, X } from "lucide-react";
import { useState, useRef } from "react";
import useInputDebounce from "~/hooks/useInputDebounce";
import useOnClickOutside from "~/hooks/useOnClickOutside";
import SearchInput from "~/components/commons/SearchInput";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/commons/Button";
import type { RunnerConfig } from "~/types/cms-runner";
import useRunnersPagination from "../../_hooks/useRunnersPagination";

interface RunnerSelectorProps {
  label: string;
  selectedRunner: RunnerConfig | null;
  onSelect: (runner: RunnerConfig | null) => void;
  searchAtom: ReturnType<typeof import("jotai").atom<string>>;
  disabledRunnerId?: string | null;
}

function RunnerSelector({
  label,
  selectedRunner,
  onSelect,
  searchAtom,
  disabledRunnerId,
}: RunnerSelectorProps) {
  const [search, setSearch] = useAtom(searchAtom);
  const debouncedSearch = useInputDebounce(search, 300);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside({
    ref: dropdownRef,
    onActivate: () => setIsOpen(false),
  });

  const {
    data: runnersPagination,
    isFetching,
    isError,
  } = useRunnersPagination({
    page_size: 20,
    search: debouncedSearch,
    sort_by: "name",
    sort_order: "asc",
  });

  const runners = runnersPagination?.pages.flatMap((page) => page.data) ?? [];

  // Filter out the disabled runner (the one already selected in the other dropdown)
  const filteredRunners = disabledRunnerId
    ? runners.filter((r) => r.id !== disabledRunnerId)
    : runners;

  const handleSelect = (runner: RunnerConfig) => {
    onSelect(runner);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onSelect(null);
    setSearch("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs text-(--gray-9) mb-1.5 block">{label}</label>

      {selectedRunner ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-(--gray-6) bg-(--gray-1) rounded-md">
            <Terminal size="1rem" className="text-(--gray-11)" />
            <span className="text-sm text-(--gray-12) font-medium truncate">
              {selectedRunner.name}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={handleClear}
            className="px-2 py-2"
            tooltip="Clear selection"
          >
            <X size="1rem" />
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-(--gray-6) bg-(--gray-1) hover:bg-(--gray-2) rounded-md text-sm text-(--gray-11) transition-colors"
        >
          <span>Select a runner...</span>
          <ChevronDown
            size="1rem"
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-(--gray-1) border border-(--gray-6) rounded-md shadow-lg overflow-hidden">
          <div className="p-2 border-b border-(--gray-6)">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search runners..."
              className="w-full"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            <Loading
              isLoading={isFetching}
              fallback={
                <div className="p-2 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              }
            >
              {isError ? (
                <div className="p-4 text-center text-sm text-(--gray-11)">
                  Error loading runners
                </div>
              ) : filteredRunners.length === 0 ? (
                <div className="p-4 text-center text-sm text-(--gray-11)">
                  {search ? "No runners found" : "No runners available"}
                </div>
              ) : (
                filteredRunners.map((runner) => (
                  <button
                    key={runner.id}
                    onClick={() => handleSelect(runner)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-(--gray-3) text-left transition-colors"
                  >
                    <Terminal size="1rem" className="text-(--gray-11) shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-(--gray-12) font-medium truncate">
                        {runner.name}
                      </p>
                      {runner.description && (
                        <p className="text-xs text-(--gray-9) truncate">
                          {runner.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </Loading>
          </div>
        </div>
      )}
    </div>
  );
}

export default RunnerSelector;
