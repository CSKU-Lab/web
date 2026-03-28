"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useExportGradebook } from "../_hooks/useExportGradebook";

export function ExportGradebookButton() {
  const { exportGradebook, isExporting } = useExportGradebook();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <DownloadIcon />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => exportGradebook("csv")}
          disabled={isExporting}
        >
          Download as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportGradebook("xlsx")}
          disabled={isExporting}
        >
          Download as XLSX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
