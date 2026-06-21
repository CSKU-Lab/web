"use client";

import { FileSpreadsheetIcon } from "lucide-react";
import { Button } from "~/components/commons/Button";
import { useExportTypingSubmissions } from "~/features/cms/sections/hooks/useExportTypingSubmissions";

export function ExportTypingButton() {
  const { exportTypingSubmissions, isExporting } = useExportTypingSubmissions();

  return (
    <Button
      variant="ghost"
      isLoading={isExporting}
      onClick={exportTypingSubmissions}
    >
      <FileSpreadsheetIcon size="1rem" />
      {isExporting ? "Exporting..." : "Export Typing"}
    </Button>
  );
}
