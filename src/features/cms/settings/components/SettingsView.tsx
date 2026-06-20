"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import PageTitle from "~/components/commons/PageTitle";
import { Button } from "~/components/commons/Button";
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

function SettingsView() {
  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminSettingsService.getSettings(),
  });

  const { data: comparesData, isLoading: isComparesLoading } = useQuery({
    queryKey: ["admin", "settings", "compares"],
    queryFn: () =>
      cmsCompareService.getPagination({
        params: { page: 1, page_size: 100 },
        includeScripts: false,
      }),
  });

  const compares = comparesData?.data ?? [];

  const [selectedCompareID, setSelectedCompareID] = useState("");

  useEffect(() => {
    if (settings?.default_compare_script_id !== undefined) {
      setSelectedCompareID(settings.default_compare_script_id);
    }
  }, [settings]);

  const saveSettings = useMutation({
    mutationFn: () =>
      adminSettingsService.updateSettings({
        default_compare_script_id: selectedCompareID,
      }),
    onSuccess: () => toast.success("Settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const isLoading = isSettingsLoading || isComparesLoading;

  return (
    <div className="p-4 space-y-6 max-w-2xl">
      <PageTitle>Settings</PageTitle>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-(--gray-12)">
            Default Compare Script
          </label>
          <p className="text-xs text-(--gray-10)">
            Used as fallback when a code material has no compare script
            configured.
          </p>
          <select
            disabled={isLoading}
            value={selectedCompareID}
            onChange={(e) => setSelectedCompareID(e.target.value)}
            className="w-full h-9 rounded-md border border-(--gray-6) bg-(--gray-1) px-3 text-sm text-(--gray-12) focus:outline-none focus:ring-2 focus:ring-(--accent-9) disabled:opacity-50"
          >
            <option value="">None</option>
            {compares.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="primary"
          disabled={saveSettings.isPending || isLoading}
          onClick={() => saveSettings.mutate()}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}

export default SettingsView;
