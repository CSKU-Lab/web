import {
  cmsMaterialService,
  type GetMaterialPaginationParams,
} from "~/services/cms-material.service";
import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";

const useMaterialPagination = (courseID: string, args: GetMaterialPaginationParams) => {
  return usePagination({
    queryKey: queryKeys.material.allWithParams(courseID, args),
    queryFn: () => cmsMaterialService.getPagination(courseID, args),
  });
};

export default useMaterialPagination;
