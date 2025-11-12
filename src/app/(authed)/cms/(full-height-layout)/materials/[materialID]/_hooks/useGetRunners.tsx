import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { configService } from "~/services/config.service";

interface Args {
  includeScript: boolean;
}

export const useGetRunners = (args?: Args) => {
  return useQuery({
    queryKey: queryKeys.config.runners.all(args),
    queryFn: () =>
      configService.getRunners({ includeScript: args?.includeScript }),
  });
};
