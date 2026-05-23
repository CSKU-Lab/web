import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  coreLabService,
  GetMaterialPaginationParams,
} from "~/services/core-lab.service";
import { coreSectionService } from "~/services/core-section.service";

const useCoreLab = () => {
  const { slug: labID, sectionID } = useParams<{
    slug: string;
    sectionID: string;
  }>();
  const useGetInfMaterial = (params: GetMaterialPaginationParams) => {
    return useInfinitePagination({
      queryKey: queryKeys.lab.materials.allWithParams(labID, params),
      queryFn: ({ pageParam }) =>
        coreLabService.getMaterialsInLabPagination(labID, sectionID, {
          ...params,
          page: pageParam,
        }),
    });
  };

  const useGetLabSection = () => {
    return useQuery({
      queryKey: queryKeys.section.lab.getById(sectionID, labID),
      queryFn: async () =>
        coreSectionService.getLabInSectionById(sectionID, labID),
      placeholderData: keepPreviousData,
      enabled: !!labID && !!sectionID,
    });
  };

  return { useGetInfMaterial, useGetLabSection };
};

export default useCoreLab;
