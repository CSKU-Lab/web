import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsCompareService } from "~/services/cms-compare.service";

export default function useCompare(compareId: string) {
  return useQuery({
    queryKey: queryKeys.compare.getById(compareId),
    queryFn: () => cmsCompareService.getById({ compareId, includeScript: true }),
    enabled: !!compareId,
  });
}
