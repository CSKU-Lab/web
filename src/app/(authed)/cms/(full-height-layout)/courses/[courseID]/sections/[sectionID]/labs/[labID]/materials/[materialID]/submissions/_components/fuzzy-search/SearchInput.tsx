"use client";

import { Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";

interface SearchInputProps {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultCount: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function SearchInput({
  query,
  onChange,
  onClear,
  resultCount,
  inputRef,
}: SearchInputProps) {
  return (
    <div className="w-full">
      {/* Input box */}
      <div className="relative bg-white rounded-2xl shadow-2xl">
        <Search
          size={22}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-(--gray-9) pointer-events-none"
        />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search students, code, filenames, IP..."
          className="pl-11 pr-10 py-7 text-lg border-0 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-(--gray-7) shadow-none bg-transparent"
        />
        {query && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-(--gray-3) rounded-md text-(--gray-9) transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Kbd hints + result count — sits directly under the input */}
      <div className="flex items-center justify-between mt-3 px-1 text-xs text-white/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white/20 rounded font-mono text-white">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white/20 rounded font-mono text-white">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white/20 rounded font-mono text-white">esc</kbd>
            Close
          </span>
        </div>
        <span>
          {resultCount} {resultCount === 1 ? "result" : "results"}
          {query && <> for &ldquo;{query}&rdquo;</>}
        </span>
      </div>
    </div>
  );
}
