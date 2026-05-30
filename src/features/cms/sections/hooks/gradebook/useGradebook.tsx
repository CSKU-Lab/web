import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { queryKeys } from "~/queryKeys";
import { cmsSectionService } from "~/services/cms-section.service";

function useGradebook() {
  const { sectionID } = useParams<{ sectionID: string }>();
  return useQuery({
    queryKey: queryKeys.section.gradebook(sectionID),
    queryFn: () => cmsSectionService.getGradebook(sectionID),
  });
}

export default useGradebook;
