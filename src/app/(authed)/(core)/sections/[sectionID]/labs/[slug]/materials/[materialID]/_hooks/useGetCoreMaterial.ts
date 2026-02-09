import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { useParams } from "next/navigation";
import { coreMaterialService } from "~/services/core-material.service";

function useGetCoreMaterial<T>() {
  const { materialID } = useParams<{ materialID: string }>();

  return useQuery({
    queryKey: queryKeys.material.core.getById(materialID),
    queryFn: async () => coreMaterialService.getById<T>(materialID),
    placeholderData: keepPreviousData,
  });
}

export default useGetCoreMaterial;
