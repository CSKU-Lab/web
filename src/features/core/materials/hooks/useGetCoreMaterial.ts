import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { useParams } from "next/navigation";
import { coreMaterialService } from "~/services/core-material.service";

function useGetCoreMaterial<T>() {
  const {
    materialID,
    sectionID,
    slug: labID,
  } = useParams<{ materialID: string; sectionID: string; slug: string }>();

  return useQuery({
    queryKey: queryKeys.core.material.getById(materialID),
    queryFn: async () =>
      coreMaterialService.getById<T>(materialID, sectionID, labID),
    placeholderData: keepPreviousData,
  });
}

export default useGetCoreMaterial;
