"use client";

import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useExportGradebook } from "~/features/cms/sections/hooks/gradebook/useExportGradebook";

export function ExportGradebookButton() {
  const { exportGradebook, isExporting } = useExportGradebook();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button isLoading={isExporting}>
          <DownloadIcon size="1rem" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => exportGradebook("csv")}
          disabled={isExporting}
          className="text-xs"
        >
          <FileTextIcon size="1rem" />
          Download as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportGradebook("xlsx")}
          disabled={isExporting}
          className="text-xs"
        >
          <FileSpreadsheetIcon size="1rem" />
          Download as XLSX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
