import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  coreLabService,
  GetMaterialPaginationParams,
} from "~/services/core-lab.service";

const useCoreLab = () => {
  const { slug: labID, sectionID } = useParams<{
    slug: string;
    sectionID: string;
  }>();
  const useGetLabDetail = () => {
    return useQuery({
      queryKey: queryKeys.lab.getById(labID),
      queryFn: async () =>
        coreLabService.getLabById(labID, { section_id: sectionID }),
      placeholderData: keepPreviousData,
    });
  };
  const useGetInfMaterial = (params: GetMaterialPaginationParams) => {
    return useInfinitePagination({
      queryKey: queryKeys.lab.materials.allWithParams(labID, params),
      queryFn: ({ pageParam }) =>
        coreLabService.getMaterialsInLabPagination(
          labID,
          {
            section_id: sectionID,
          },
          {
            ...params,
            page: pageParam,
          },
        ),
    });
  };

  return { useGetLabDetail, useGetInfMaterial };
};

export default useCoreLab;
