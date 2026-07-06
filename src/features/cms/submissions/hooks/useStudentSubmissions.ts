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
    // Regrade re-queues submissions asynchronously (the API returns 202 and a
    // background job flips each row to "queued", then the grader drives it to a
    // terminal state). This list has no live stream, so poll while any submission
    // is still in flight and stop once everything is terminal.
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      const inFlight = data.some(
        (s) => s.status === "queued" || s.status === "running",
      );
      return inFlight ? 2500 : false;
    },
  });
}
