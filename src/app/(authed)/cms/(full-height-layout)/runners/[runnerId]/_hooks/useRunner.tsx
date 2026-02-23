import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsRunnerService } from "~/services/cms-runner.service";

export default function useRunner(runnerId: string) {
  return useQuery({
    queryKey: queryKeys.runner.getById(runnerId),
    queryFn: () => cmsRunnerService.getById({ runnerId, includeScript: true }),
    enabled: !!runnerId,
  });
}
