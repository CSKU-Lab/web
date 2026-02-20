"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import type { FuseResultMatch, IFuseOptions } from "fuse.js";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";

interface UseFuzzySearchParams {
  students: CMSSectionStudentSubmission[];
  query: string;
}

interface FuzzySearchResult {
  item: CMSSectionStudentSubmission;
  score: number;
  matches: readonly FuseResultMatch[];
}

const fuseOptions: IFuseOptions<CMSSectionStudentSubmission> = {
  keys: [
    { name: "student.display_name", weight: 5 },
    { name: "student.username", weight: 4 },
    { name: "payload.files.name", weight: 2 },
    { name: "payload.files.content", weight: 1 },
    { name: "ip", weight: 1 },
    { name: "payload.submission_id", weight: 0.5 },
  ],
  // 0 = exact, 1 = anything — 0.2 requires a fairly close match
  threshold: 0.1,
  // Disable location penalty so matches anywhere in a long string score equally
  ignoreLocation: true,
  // Require at least 3 chars to avoid noise from single/double char matches
  minMatchCharLength: 3,
  includeScore: true,
  includeMatches: true,
  // Return char-level indices so we can highlight and build hunks
  findAllMatches: false,
  useExtendedSearch: false,
};

export function useFuzzySearch({
  students,
  query,
}: UseFuzzySearchParams): FuzzySearchResult[] {
  const fuse = useMemo(() => {
    return new Fuse(students, fuseOptions);
  }, [students]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return students.map((student) => ({
        item: student,
        score: 0,
        matches: [],
      }));
    }

    const searchResults = fuse.search(query);
    return searchResults.map((result) => ({
      item: result.item,
      score: result.score ?? 0,
      matches: result.matches ?? [],
    }));
  }, [fuse, query, students]);

  return results;
}
