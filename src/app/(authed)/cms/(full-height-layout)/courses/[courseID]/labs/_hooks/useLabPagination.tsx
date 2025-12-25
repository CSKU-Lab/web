import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsLabService,
  type GetLabPaginationParams,
} from "~/services/cms-lab.service";

interface Params {
  course_id: string;
  args: GetLabPaginationParams;
}

const useLabPagination = (params: Params) => {
  const { course_id, args } = params;
  return usePagination({
    queryKey: queryKeys.lab.allWithParams(params),
    queryFn: ({ pageParam }) =>
      cmsLabService.getPagination(
        { ...args, page: pageParam },
        "/cms/courses",
        `/${course_id}/labs`,
      ),
  });
};

export default useLabPagination;
