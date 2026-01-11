import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { useParams } from "next/navigation";
import { cmsMaterialService } from "~/services/cms-material.service";

function useGetMaterial() {
  const { materialID } = useParams<{ materialID: string }>();

  return useQuery({
    queryKey: queryKeys.material.getById(materialID),
    queryFn: async () => cmsMaterialService.getById(materialID),
    placeholderData: keepPreviousData,
  });
}

export default useGetMaterial;
