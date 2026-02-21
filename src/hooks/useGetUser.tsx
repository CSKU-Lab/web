import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsUserService } from "~/services/cms-user.service";

interface Args {
  userId: string;
}

function useGetUser({ userId }: Args) {
  return useQuery({
    queryKey: queryKeys.user.getById(userId),
    queryFn: () => cmsUserService.getByID(userId),
  });
}

export default useGetUser;
