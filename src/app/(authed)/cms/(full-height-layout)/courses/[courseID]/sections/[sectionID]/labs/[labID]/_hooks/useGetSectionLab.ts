"use client";

import { useQuery } from "@tanstack/react-query";
import { cmsSectionService } from "~/services/cms-section.service";
import { queryKeys } from "~/queryKeys";

interface UseGetSectionLabParams {
  sectionID: string;
  labID: string;
}

export function useGetSectionLab({ sectionID, labID }: UseGetSectionLabParams) {
  return useQuery({
    queryKey: [...queryKeys.section.labs.all(sectionID), labID, "detail"],
    queryFn: () => cmsSectionService.getLabDetail(sectionID, labID),
    enabled: !!sectionID && !!labID,
  });
}
