import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { queryKeys } from "~/queryKeys";
import { cmsRunnerService } from "~/services/cms-runner.service";

export default function useRunner() {
  const { runnerId } = useParams<{ runnerId: string }>();

  return useQuery({
    queryKey: queryKeys.runner.getById(runnerId),
    queryFn: () => cmsRunnerService.getById(runnerId),
    enabled: !!runnerId,
  });
}
