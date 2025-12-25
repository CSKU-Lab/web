import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsAffectedEntitiesService } from "~/services/cms-affected-entities.service";
<<<<<<< HEAD
import type { AffectedType } from "~/types/cms-affected-entities";
||||||| parent of b8906f9 (add: lab management pages & integrate: with be apis)
=======
import { AffectedType } from "~/types/cms-affected-entities";
>>>>>>> b8906f9 (add: lab management pages & integrate: with be apis)

function useGetAffectedEntities(type: AffectedType, id: string) {
  return useQuery({
    queryKey: queryKeys.affectedEntities.get(type, id),
    queryFn: () => cmsAffectedEntitiesService.get(type, id),
  });
}

export default useGetAffectedEntities;
