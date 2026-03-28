"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { cmsSectionService } from "~/services/cms-section.service";

export type ExportFormat = "csv" | "xlsx";

export function useExportGradebook() {
  const { sectionID } = useParams<{ sectionID: string }>();
  const [isExporting, setIsExporting] = useState(false);

  const exportGradebook = async (format: ExportFormat) => {
    setIsExporting(true);

    try {
      const blob = await cmsSectionService.exportGradebook(sectionID, format);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `gradebook_${sectionID}_${timestamp}.${format}`;

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Gradebook exported successfully!");
    } catch (error) {
      console.error("Failed to export gradebook:", error);
      toast.error("Failed to export gradebook");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportGradebook,
    isExporting,
  };
}
