"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsSectionService } from "~/services/cms-section.service";
import { queryKeys } from "~/queryKeys";
import type { UpdateSectionLabSchema } from "~/features/cms/sections/schemas/lab-settings/update-section-lab.schema";

interface UseUpdateSectionLabParams {
  sectionID: string;
  labID: string;
}

export function useUpdateSectionLab({
  sectionID,
  labID,
}: UseUpdateSectionLabParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSectionLabSchema) => {
      const payload = {
        status: data.status,
        opened_at: data.opened_at ? data.opened_at.toISOString() : null,
        readonly_at: data.readonly_at ? data.readonly_at.toISOString() : null,
      };
      return cmsSectionService.updateSectionLab(sectionID, labID, payload);
    },
    onSuccess: async () => {
      // Invalidate the specific section lab detail query
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.labs.getById(sectionID, labID),
      });
      // Invalidate the legacy detail query format (for backward compatibility)
      await queryClient.invalidateQueries({
        queryKey: [...queryKeys.section.labs.all(sectionID), labID, "detail"],
      });
      // Invalidate all section labs list queries
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.labs.all(sectionID),
      });
      // Invalidate lab status query (status may have changed)
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.labs.status(sectionID, labID),
      });
      // Invalidate lab materials (they may be affected by status changes)
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.labs.materials.all(sectionID, labID),
      });
      // Invalidate parent section to refresh section detail views
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.getById(sectionID),
      });
      // Invalidate breadcrumb cache for this lab
      await queryClient.invalidateQueries({
        queryKey: ["breadcrumb", "lab", labID],
      });
      // Invalidate breadcrumb cache for parent section
      await queryClient.invalidateQueries({
        queryKey: ["breadcrumb", "section", sectionID],
      });
    },
  });
}
