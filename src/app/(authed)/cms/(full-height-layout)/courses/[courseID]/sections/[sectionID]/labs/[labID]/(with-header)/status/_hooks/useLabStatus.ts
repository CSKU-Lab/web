import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsSectionService } from "~/services/cms-section.service";

interface Args {
  sectionID: string;
  labID: string;
}

export function useLabStatus({ sectionID, labID }: Args) {
  return useQuery({
    queryKey: queryKeys.section.labs.status(sectionID, labID),
    queryFn: () => cmsSectionService.getStudentLabStatus(sectionID, labID),
  });
}
