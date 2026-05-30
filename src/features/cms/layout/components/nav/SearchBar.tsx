"use client";

import { Search } from "lucide-react";
import { useSetAtom } from "jotai";
import { commandPaletteAtom } from "~/globalStore/commandPalette";
import { Kbd, KbdGroup } from "~/components/ui/kbd";
import { isMac } from "~/lib/tiptap-utils";

function SearchBar() {
  const setPalette = useSetAtom(commandPaletteAtom);
  const mac = isMac();

  return (
    <button
      type="button"
      onClick={() => setPalette({ isOpen: true })}
      className="flex items-center gap-2 w-full px-2 py-1.5 mb-3 rounded-lg border border-(--gray-6) bg-(--gray-2) text-(--gray-9) hover:bg-(--gray-3) hover:text-(--gray-11) transition-colors text-sm"
    >
      <Search className="w-3.5 h-3.5 shrink-0" />
      <span className="flex-1 text-left">Search...</span>
      <KbdGroup className="hidden sm:inline-flex">
        <Kbd>{mac ? "⌘" : "Ctrl"}</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  );
}

export default SearchBar;
