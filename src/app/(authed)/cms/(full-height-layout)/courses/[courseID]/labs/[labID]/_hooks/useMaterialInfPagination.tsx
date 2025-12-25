import { queryKeys } from "~/queryKeys";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import {
  cmsLabMaterialService,
  type GetLabMaterialPaginationRequest,
} from "~/services/cms-lab-material.service";

const useLabMaterialInfPagination = (
  params: GetLabMaterialPaginationRequest,
) => {
  const { labID, ...args } = params;
  return useInfinitePagination({
    queryKey: queryKeys.material.allWithParams(args),
    queryFn: ({ pageParam }) =>
      cmsLabMaterialService.getPagination(
        { ...args, page: pageParam },
        "/cms/labs",
        `/${labID}/materials`,
      ),
  });
};

export default useLabMaterialInfPagination;
