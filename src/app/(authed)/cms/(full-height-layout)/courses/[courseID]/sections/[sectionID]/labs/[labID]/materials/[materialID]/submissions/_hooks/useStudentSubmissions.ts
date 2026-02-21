"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsSectionService } from "~/services/cms-section.service";
import type { CodeSubmissionData } from "~/types/cms-section-submission";

interface Args {
  sectionID: string;
  labID: string;
  materialID: string;
}

export function useAllStudentsLatestSubmissions({
  sectionID,
  labID,
  materialID,
}: Args) {
  return useQuery({
    queryKey: queryKeys.section.submissions(sectionID, labID, materialID),
    queryFn: async () => {
      return cmsSectionService.getAllStudentsLatestSubmission<CodeSubmissionData>(
        sectionID,
        labID,
        materialID,
      );
    },
    enabled: !!sectionID && !!labID && !!materialID,
  });
}
