import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import {
  configService,
  GetRunnerPaginationParams,
} from "~/services/cms-compare.service";

export const useGetRunners = (args: GetRunnerPaginationParams) => {
  return useQuery({
    queryKey: queryKeys.configs.runners.all(args),
    queryFn: () => configService.getRunners(args),
  });
};
