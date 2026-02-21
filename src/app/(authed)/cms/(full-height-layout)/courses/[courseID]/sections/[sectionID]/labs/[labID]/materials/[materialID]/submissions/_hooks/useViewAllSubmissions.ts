"use client";

import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsSectionService,
  GetStudentSubmissionsPaginationParams,
} from "~/services/cms-section.service";
import type { CodeSubmissionData } from "~/types/cms-section-submission";

interface Args {
  sectionID: string;
  labID: string;
  materialID: string;
  student_id: string;
  params?: GetStudentSubmissionsPaginationParams<CodeSubmissionData>;
}

export function useStudentSubmissions({
  sectionID,
  labID,
  materialID,
  student_id,
  params,
}: Args) {
  return useInfinitePagination({
    queryKey: queryKeys.section.submissionsOfStudent(
      sectionID,
      labID,
      materialID,
      student_id,
      params,
    ),
    queryFn: ({ pageParam }) => {
      return cmsSectionService.getStudentSubmissions<CodeSubmissionData>(
        sectionID,
        labID,
        materialID,
        student_id,
        {
          ...params,
          page: pageParam,
        },
      );
    },
  });
}
