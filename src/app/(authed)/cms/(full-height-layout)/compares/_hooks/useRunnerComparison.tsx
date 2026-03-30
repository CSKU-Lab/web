import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsRunnerService } from "~/services/cms-runner.service";
import type { RunnerConfigDetail } from "~/types/cms-runner";

export function useRunnerDetail(runnerId: string | null) {
  return useQuery<RunnerConfigDetail>({
    queryKey: runnerId ? queryKeys.runner.getById(runnerId) : ["runner", "null"],
    queryFn: () => {
      if (!runnerId) throw new Error("Runner ID is required");
      return cmsRunnerService.getById({ runnerId, includeScript: true });
    },
    enabled: !!runnerId,
  });
}
