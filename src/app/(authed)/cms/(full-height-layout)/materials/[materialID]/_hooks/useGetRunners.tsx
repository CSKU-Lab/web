import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { configService } from "~/services/config.service";

export const useGetRunners = () => {
  return useQuery({
    queryKey: queryKeys.config.runners.all,
    queryFn: () => configService.getRunners(),
  });
};
