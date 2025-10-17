import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsSemesterService } from "~/services/cms-semester.service";

function useGetAffectedSections(semesterID: string) {
  return useQuery({
    queryKey: queryKeys.semester.affectedSections(semesterID),
    queryFn: () => cmsSemesterService.getAffectedSections(semesterID),
  });
}

export default useGetAffectedSections;
