"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsSectionService } from "~/services/cms-section.service";
import type { CodeSubmissionData } from "~/types/cms-section-submission";

// TODO: Remove mock import when backend API is ready
import { mockStudentSubmissions } from "../_mocks/submissions.mock";

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
      // TODO: Replace with real API call when backend is ready
      // return cmsSectionService.getStudentSubmissions<CodeSubmissionData>(
      //   sectionID,
      //   labID,
      //   materialID,
      // );
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockStudentSubmissions;
    },
    enabled: !!sectionID && !!labID && !!materialID,
  });
}
