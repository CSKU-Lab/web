"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, Check, ChevronsUpDown, SearchX } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { Button } from "~/components/commons/Button";
import { Popover, PopoverAnchor, PopoverContent } from "~/components/ui/popover";
import { cmsCompareService } from "~/services/cms-compare.service";
import { BaseService } from "~/services/base.service";
import useInputDebounce from "~/hooks/useInputDebounce";
import { cn } from "~/lib/utils";

class AdminSettingsService extends BaseService {
  constructor() {
    super("/admin/settings");
  }

  async getSettings(): Promise<{ default_compare_script_id: string }> {
    const res = await this.api.get(this._baseURL);
    return res.data;
  }

  async updateSettings(data: { default_compare_script_id: string }) {
    return this.api.put(this._baseURL, data);
  }
}

const adminSettingsService = new AdminSettingsService();

function DefaultCompareScriptDialog() {
  const [open, setOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedCompare, setSelectedCompare] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminSettingsService.getSettings(),
    enabled: open,
  });

  const { data: comparesData, isFetching: isSearching } = useQuery({
    queryKey: ["admin", "settings", "compares", "search", debouncedSearch],
    queryFn: () =>
      cmsCompareService.getPagination({
        params: { page: 1, page_size: 20, search: debouncedSearch },
        includeScripts: false,
      }),
    enabled: open && comboOpen,
  });

  const compares = comparesData?.data ?? [];

  useEffect(() => {
    if (!open) {
      setSelectedCompare(null);
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    if (settings?.default_compare_script_id) {
      cmsCompareService
        .getById({
          compareId: settings.default_compare_script_id,
          includeScript: false,
        })
        .then((c) => setSelectedCompare({ id: c.id, name: c.name }))
        .catch(() => {});
    }
  }, [settings]);

  const saveSettings = useMutation({
    mutationFn: () =>
      adminSettingsService.updateSettings({
        default_compare_script_id: selectedCompare?.id ?? "",
      }),
    onSuccess: () => {
      toast.success("Settings saved");
      setOpen(false);
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const handleSelect = (compare: { id: string; name: string }) => {
    setSelectedCompare(compare);
    setComboOpen(false);
    setSearch("");
  };

  const handleComboOpen = () => {
    setComboOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shrink-0 px-3 py-1.5">
          <Settings size="1rem" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-4 py-3">
          <DialogTitle>Compare Settings</DialogTitle>
        </DialogHeader>
        <DialogBody className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-(--gray-12)">
              Default Compare Script
            </label>
            <p className="text-xs text-(--gray-10)">
              Used as fallback when a code material has no compare script
              configured.
            </p>

            <Popover open={comboOpen}>
              <PopoverAnchor className="w-full">
                <button
                  type="button"
                  disabled={isSettingsLoading}
                  onClick={handleComboOpen}
                  className="flex w-full items-center justify-between h-9 rounded-md border border-(--gray-6) bg-(--gray-1) px-3 text-sm text-(--gray-12) focus:outline-none focus:ring-2 focus:ring-(--accent-9) disabled:opacity-50"
                >
                  <span className={cn(!selectedCompare && "text-(--gray-10)")}>
                    {selectedCompare?.name ?? "Select a compare script..."}
                  </span>
                  <ChevronsUpDown size="0.875rem" className="text-(--gray-10)" />
                </button>
              </PopoverAnchor>
              <PopoverContent
                onInteractOutside={() => {
                  setComboOpen(false);
                  setSearch("");
                }}
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="w-(--radix-popper-anchor-width) p-0"
              >
                <div className="border-b border-(--gray-6) px-3 py-2">
                  <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm outline-none text-(--gray-12) placeholder:text-(--gray-10)"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {isSearching ? (
                    <div className="py-4 text-center text-xs text-(--gray-10)">
                      Searching...
                    </div>
                  ) : compares.length === 0 ? (
                    <div className="flex flex-col items-center gap-1 py-6 text-(--gray-10)">
                      <SearchX size="1.25rem" />
                      <p className="text-xs">No results</p>
                    </div>
                  ) : (
                    compares.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelect({ id: c.id, name: c.name })}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-(--gray-12) hover:bg-(--gray-3) cursor-pointer",
                          selectedCompare?.id === c.id && "bg-(--gray-3)",
                        )}
                      >
                        <Check
                          size="0.875rem"
                          className={cn(
                            "shrink-0",
                            selectedCompare?.id === c.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {c.name}
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="primary"
            disabled={saveSettings.isPending || isSettingsLoading || !selectedCompare}
            onClick={() => saveSettings.mutate()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DefaultCompareScriptDialog;
