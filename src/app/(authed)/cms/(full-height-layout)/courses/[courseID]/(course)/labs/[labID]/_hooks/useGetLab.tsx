import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsLabService } from "~/services/cms-lab.service";

interface Args {
  labID: string;
}

function useGetLab({ labID }: Args) {
  return useQuery({
    queryKey: queryKeys.lab.getById(labID),
    queryFn: () => cmsLabService.getById(labID),
  });
}

export default useGetLab;
