"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsMaterialService } from "~/services/cms-material.service";

interface UseGetMaterialParams {
  courseID: string;
  materialID: string;
}

export function useGetMaterial({ courseID, materialID }: UseGetMaterialParams) {
  return useQuery({
    queryKey: queryKeys.material.getById(courseID, materialID),
    queryFn: () => cmsMaterialService.getById(courseID, materialID),
    enabled: !!courseID && !!materialID,
  });
}
