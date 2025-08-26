import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  userGroupService,
  type GetUserGroupPaginationParams,
} from "~/services/user-group.service";
import type { UserGroup } from "~/types/cms-user-group";

function useUserGroupPagination(args: GetUserGroupPaginationParams) {
  return useInfinitePagination<UserGroup>({
    queryKey: queryKeys.user_group.allWithParams(args),
    queryFn: ({ pageParam }) =>
      userGroupService.getPagination({ ...args, page: pageParam }),
  });
}

export default useUserGroupPagination;
