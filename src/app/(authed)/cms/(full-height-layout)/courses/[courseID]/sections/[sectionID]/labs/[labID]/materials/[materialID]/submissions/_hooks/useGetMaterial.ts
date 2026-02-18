"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsMaterialService } from "~/services/cms-material.service";

interface UseGetMaterialParams {
  materialID: string;
}

export function useGetMaterial({ materialID }: UseGetMaterialParams) {
  return useQuery({
    queryKey: queryKeys.material.getById(materialID),
    queryFn: () => cmsMaterialService.getById(materialID),
    enabled: !!materialID,
  });
}
