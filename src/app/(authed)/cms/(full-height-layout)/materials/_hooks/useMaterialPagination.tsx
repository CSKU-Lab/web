import {
  cmsMaterialService,
  type GetMaterialPaginationParams,
} from "~/services/cms-material.service";
import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";

const useMaterialPagination = (args: GetMaterialPaginationParams) => {
  return usePagination({
    queryKey: queryKeys.material.allWithParams(args),
    queryFn: () => cmsMaterialService.getPagination(args),
  });
};

export default useMaterialPagination;
