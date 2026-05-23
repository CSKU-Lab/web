"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useHotkeys } from "react-hotkeys-hook";
import { useQuery } from "@tanstack/react-query";
import { Book, FlaskConical, FileText, Users, SquareStack, Layers } from "lucide-react";
import { commandPaletteAtom } from "~/globalStore/commandPalette";
import { useSession } from "~/providers/SessionProvider";
import { cmsSearchService } from "~/services/cms-search.service";
import { queryKeys } from "~/queryKeys";
import { navigationItems } from "./config";
import { useDebounce } from "~/hooks/use-debounce";

const GROUP_CLASS =
  "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-(--gray-9)";

const ITEM_CLASS =
  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-(--gray-12) data-[selected=true]:bg-(--gray-4) outline-none";

const ICON_CLASS = "text-(--gray-10) shrink-0";

export default function CommandPalette() {
  const [{ isOpen }, setPalette] = useAtom(commandPaletteAtom);
  const router = useRouter();
  const { user } = useSession();
  const [inputValue, setInputValue] = useState("");

  const isAdmin = user.roles.includes("admin");
  const debouncedQ = useDebounce(inputValue, 300);

  const open = useCallback(() => {
    setInputValue("");
    setPalette({ isOpen: true });
  }, [setPalette]);

  const close = useCallback(() => setPalette({ isOpen: false }), [setPalette]);

  // Clear input whenever palette opens (covers SearchBar open path too)
  useEffect(() => {
    if (isOpen) setInputValue("");
  }, [isOpen]);

  useHotkeys("mod+k", open, { enableOnFormTags: false, preventDefault: true });

  const { data: searchData, isFetching } = useQuery({
    queryKey: queryKeys.search.cms(debouncedQ),
    queryFn: () => cmsSearchService.search(debouncedQ, 5),
    enabled: isOpen && debouncedQ.length > 0,
    staleTime: 10_000,
  });

  const handleSelect = useCallback(
    (path: string) => {
      close();
      router.push(path);
    },
    [close, router],
  );

  const navItems = navigationItems.filter((item) => !item.adminOnly || isAdmin);
  const showSearch = debouncedQ.length > 0;

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(v) => setPalette({ isOpen: v })}
      overlayClassName="fixed inset-0 z-50 bg-black/50"
      contentClassName="fixed top-[20%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-lg border border-(--gray-6) bg-(--gray-2) shadow-lg"
      shouldFilter={!showSearch}
      loop
    >
      <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
      <CommandInput
        placeholder="Search..."
        value={inputValue}
        onValueChange={setInputValue}
        className="flex h-11 w-full bg-transparent px-4 text-sm outline-none placeholder:text-(--gray-9) border-b border-(--gray-6)"
      />
      <CommandList className="max-h-80 overflow-y-auto p-2">
        {!showSearch && (
          <>
            <CommandEmpty className="py-6 text-center text-sm text-(--gray-9)">
              No results found.
            </CommandEmpty>
            <CommandGroup heading="Navigation" className={GROUP_CLASS}>
              {navItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`nav-${item.id}`}
                  keywords={item.keywords}
                  onSelect={() => handleSelect(item.href)}
                  className={ITEM_CLASS}
                >
                  <span className={ICON_CLASS}>{item.icon}</span>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {showSearch && (
          <>
            {isFetching && (
              <CommandLoading className="py-4 text-center text-sm text-(--gray-9)">
                Searching…
              </CommandLoading>
            )}

            {!isFetching && !searchData && (
              <CommandEmpty className="py-6 text-center text-sm text-(--gray-9)">
                No results found.
              </CommandEmpty>
            )}

            {searchData && (
              <>
                {searchData.courses.length > 0 && (
                  <CommandGroup heading="Courses" className={GROUP_CLASS}>
                    {searchData.courses.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`course-${item.id}`}
                        onSelect={() => handleSelect(item.path)}
                        className={ITEM_CLASS}
                      >
                        <Book size="1rem" className={ICON_CLASS} />
                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {searchData.labs.length > 0 && (
                  <CommandGroup heading="Labs" className={GROUP_CLASS}>
                    {searchData.labs.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`lab-${item.id}`}
                        onSelect={() => handleSelect(item.path)}
                        className={ITEM_CLASS}
                      >
                        <FlaskConical size="1rem" className={ICON_CLASS} />
                        <span className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-xs text-(--gray-9)">{item.course_name}</span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {searchData.materials.length > 0 && (
                  <CommandGroup heading="Materials" className={GROUP_CLASS}>
                    {searchData.materials.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`material-${item.id}`}
                        onSelect={() => handleSelect(item.path)}
                        className={ITEM_CLASS}
                      >
                        <FileText size="1rem" className={ICON_CLASS} />
                        <span className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-xs text-(--gray-9)">{item.course_name}</span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {searchData.sections.length > 0 && (
                  <CommandGroup heading="Sections" className={GROUP_CLASS}>
                    {searchData.sections.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`section-${item.id}`}
                        onSelect={() => handleSelect(item.path)}
                        className={ITEM_CLASS}
                      >
                        <Users size="1rem" className={ICON_CLASS} />
                        <span className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-xs text-(--gray-9)">{item.course_name}</span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {searchData.section_labs.length > 0 && (
                  <CommandGroup heading="Section Labs" className={GROUP_CLASS}>
                    {searchData.section_labs.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`section-lab-${item.id}`}
                        onSelect={() => handleSelect(item.path)}
                        className={ITEM_CLASS}
                      >
                        <SquareStack size="1rem" className={ICON_CLASS} />
                        <span className="flex flex-col">
                          <span>{item.lab_name}</span>
                          <span className="text-xs text-(--gray-9)">
                            {item.course_name} › {item.section_name}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {searchData.section_lab_materials.length > 0 && (
                  <CommandGroup heading="Section Lab Materials" className={GROUP_CLASS}>
                    {searchData.section_lab_materials.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`section-lab-material-${item.id}`}
                        onSelect={() => handleSelect(item.path)}
                        className={ITEM_CLASS}
                      >
                        <Layers size="1rem" className={ICON_CLASS} />
                        <span className="flex flex-col">
                          <span>{item.material_name}</span>
                          <span className="text-xs text-(--gray-9)">
                            {item.course_name} › {item.section_name} › {item.lab_name}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
