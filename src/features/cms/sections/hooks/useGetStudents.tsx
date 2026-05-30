import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsSectionService } from "~/services/cms-section.service";

function useGetSection(sectionID: string) {
  return useQuery({
    queryKey: queryKeys.section.getStudents(sectionID),
    queryFn: () => cmsSectionService.getStudents(sectionID),
  });
}

export default useGetSection;
