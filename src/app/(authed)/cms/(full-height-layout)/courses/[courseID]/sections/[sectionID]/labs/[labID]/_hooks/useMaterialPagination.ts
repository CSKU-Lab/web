"use client";

import {
  cmsLabMaterialService,
  GetLabMaterialPaginationParams,
} from "~/services/cms-lab-material.service";
import { queryKeys } from "~/queryKeys";
import useInfinitePagination from "~/hooks/useInfinitePagination";

interface UseMaterialInfPaginationParams {
  sectionID: string;
  labID: string;
  params: GetLabMaterialPaginationParams;
}

export function useMaterialPagination({
  sectionID,
  labID,
  params,
}: UseMaterialInfPaginationParams) {
  return useInfinitePagination({
    queryKey: queryKeys.section.labs.materials.allWithParams(
      sectionID,
      labID,
      {},
    ),
    queryFn: async ({ pageParam }) => {
      const response = await cmsLabMaterialService.getPagination(labID, {
        page: pageParam,
        ...params,
      });
      return response;
    },
  });
}
