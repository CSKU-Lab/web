"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsSectionService } from "~/services/cms-section.service";
import type { CodeSubmissionData } from "~/types/cms-section-submission";

interface UseStudentSubmissionsParams {
  sectionID: string;
  labID: string;
  materialID: string;
}

export function useStudentSubmissions({
  sectionID,
  labID,
  materialID,
}: UseStudentSubmissionsParams) {
  return useQuery({
    queryKey: queryKeys.section.submissions(sectionID, labID, materialID),
    queryFn: async () => {
      return cmsSectionService.getStudentSubmissions<CodeSubmissionData>(
        sectionID,
        labID,
        materialID,
      );
    },
    enabled: !!sectionID && !!labID && !!materialID,
  });
}
