"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cmsCompareService } from "~/services/cms-compare.service";
import { BaseService } from "~/services/base.service";

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

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminSettingsService.getSettings(),
    enabled: open,
  });

  const { data: comparesData, isLoading: isComparesLoading } = useQuery({
    queryKey: ["admin", "settings", "compares"],
    queryFn: () =>
      cmsCompareService.getPagination({
        params: { page: 1, page_size: 100 },
        includeScripts: false,
      }),
    enabled: open,
  });

  const compares = comparesData?.data ?? [];

  const [selectedCompareID, setSelectedCompareID] = useState("");

  useEffect(() => {
    if (settings?.default_compare_script_id) {
      setSelectedCompareID(settings.default_compare_script_id);
    }
  }, [settings]);

  const saveSettings = useMutation({
    mutationFn: () =>
      adminSettingsService.updateSettings({
        default_compare_script_id: selectedCompareID,
      }),
    onSuccess: () => {
      toast.success("Settings saved");
      setOpen(false);
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const isLoading = isSettingsLoading || isComparesLoading;

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
            <Select
              disabled={isLoading}
              value={selectedCompareID}
              onValueChange={setSelectedCompareID}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a compare script..." />
              </SelectTrigger>
              <SelectContent>
                {compares.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="primary"
            disabled={saveSettings.isPending || isLoading || !selectedCompareID}
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
