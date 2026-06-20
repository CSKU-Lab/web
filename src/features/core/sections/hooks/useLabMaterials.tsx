import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import { coreLabService } from "~/services/core-lab.service";
import type { LabMaterial } from "~/types/core-lab-material";
import type { GetMaterialPaginationParams } from "~/services/core-lab.service";

const BASE_PARAMS: GetMaterialPaginationParams = {
  page_size: 12,
  sort_by: "position" as keyof LabMaterial,
  sort_order: "asc",
  filters: [],
};

function useLabMaterials(labID: string, sectionID: string, enabled: boolean) {
  return useInfinitePagination({
    queryKey: [...queryKeys.lab.materials.all(labID), { sectionID, ...BASE_PARAMS }],
    queryFn: ({ pageParam }) =>
      coreLabService.getMaterialsInLabPagination(labID, sectionID, {
        ...BASE_PARAMS,
        page: pageParam,
      }),
    enabled,
  });
}

export default useLabMaterials;
