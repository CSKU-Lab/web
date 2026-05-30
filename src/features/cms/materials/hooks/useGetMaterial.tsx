import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { useParams } from "next/navigation";
import { cmsMaterialService } from "~/services/cms-material.service";

function useGetMaterial() {
  const { courseID, materialID } = useParams<{
    courseID: string;
    materialID: string;
  }>();

  return useQuery({
    queryKey: queryKeys.material.getById(courseID, materialID),
    queryFn: async () => cmsMaterialService.getById(courseID, materialID),
    placeholderData: keepPreviousData,
  });
}

export default useGetMaterial;
