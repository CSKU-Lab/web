import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsLabMaterialService } from "~/services/cms-lab-material.service";

interface Args {
  labID: string;
}

function useGetLabMaterial({ labID }: Args) {
  return useQuery({
    queryKey: queryKeys.labMaterial.getByLabId(labID),
    queryFn: () => cmsLabMaterialService.getByLabId(labID),
  });
}

export default useGetLabMaterial;
