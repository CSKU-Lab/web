"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { cmsLabMaterialService } from "~/services/cms-lab-material.service";
import { queryKeys } from "~/queryKeys";
import type { CMSLabMaterial } from "~/types/cms-lab-material";

interface UseMaterialInfPaginationParams {
  labID: string;
  pageSize?: number;
}

export function useMaterialInfPagination({
  labID,
  pageSize = 10,
}: UseMaterialInfPaginationParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.labMaterial.getByLabId(labID),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await cmsLabMaterialService.getPagination(labID, {
        page: pageParam,
        page_size: pageSize,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.total_page) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 1,
    enabled: !!labID,
  });
}
