import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsDefaultLabService,
  type GetDefaultLabPaginationParams,
} from "~/services/cms-default-lab.service";

interface Params {
  course_id: string;
  args: GetDefaultLabPaginationParams;
}

const useDefaultLabPagination = (params: Params) => {
  const { course_id, args } = params;
  return usePagination({
    queryKey: queryKeys.defaultLab.allWithParams(params),
    queryFn: () => cmsDefaultLabService.getPagination(course_id, args),
  });
};

export default useDefaultLabPagination;
