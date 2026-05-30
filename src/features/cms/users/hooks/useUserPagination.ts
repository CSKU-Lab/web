import {
  userService,
  type GetUserPaginationParams,
} from "~/services/user.service";
import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";

const useUserPagination = (args: GetUserPaginationParams) => {
  return usePagination({
    queryKey: queryKeys.user.allWithParams(args),
    queryFn: () => userService.getPagination(args),
  });
};

export default useUserPagination;
