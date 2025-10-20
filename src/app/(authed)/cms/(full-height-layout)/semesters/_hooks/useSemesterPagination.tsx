import {
  cmsSemesterService,
  type GetSemesterPaginationParams,
} from "~/services/cms-semester.service";
import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";

const useSemesterPagination = (args: GetSemesterPaginationParams) => {
  return usePagination({
    queryKey: queryKeys.semester.allWithParams(args),
    queryFn: () => cmsSemesterService.getPagination(args),
  });
};

export default useSemesterPagination;
