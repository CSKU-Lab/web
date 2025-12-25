import { queryKeys } from "~/queryKeys";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import {
  cmsLabMaterialService,
  type GetLabMaterialPaginationRequest,
} from "~/services/cms-lab-material.service";

const useLabMaterialInfPagination = (
  params: GetLabMaterialPaginationRequest,
) => {
  const { labID, payload } = params;
  return useInfinitePagination({
    queryKey: queryKeys.material.allWithParams(payload),
    queryFn: () => cmsLabMaterialService.getPagination(labID, payload),
  });
};

export default useLabMaterialInfPagination;
