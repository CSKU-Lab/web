"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsSectionService } from "~/services/cms-section.service";
import { queryKeys } from "~/queryKeys";
import type { UpdateSectionLabSchema } from "../_schemas/update-section-lab.schema";

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
        closed_at: data.closed_at ? data.closed_at.toISOString() : null,
      };
      return cmsSectionService.updateSectionLab(sectionID, labID, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...queryKeys.section.labs.all(sectionID), labID, "detail"],
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.labs.all(sectionID),
      });
    },
  });
}
