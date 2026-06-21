"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { cmsSectionService } from "~/services/cms-section.service";

export function useExportTypingSubmissions() {
  const { sectionID } = useParams<{ sectionID: string }>();
  const [isExporting, setIsExporting] = useState(false);

  const exportTypingSubmissions = async () => {
    setIsExporting(true);
    try {
      const blob = await cmsSectionService.exportTypingSubmissions(sectionID);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `typing_submissions_${sectionID}_${timestamp}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Typing submissions exported successfully!");
    } catch {
      toast.error("Failed to export typing submissions");
    } finally {
      setIsExporting(false);
    }
  };

  return { exportTypingSubmissions, isExporting };
}
