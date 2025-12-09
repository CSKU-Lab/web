import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsAffectedEntitiesService } from "~/services/cms-affected-entities.service";

function useGetAffectedEntities(type: "course" | "semester", id: string) {
  return useQuery({
    queryKey: queryKeys.affectedEntities.get(type, id),
    queryFn: () => cmsAffectedEntitiesService.get(type, id),
  });
}

export default useGetAffectedEntities;
