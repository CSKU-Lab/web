import usePagination from "~/hooks/usePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsSectionService,
  type GetSectionLabPaginationParams,
} from "~/services/cms-section.service";
import { useParams } from "next/navigation";

const useLabPagination = (params: GetSectionLabPaginationParams) => {
  const { sectionID } = useParams<{ sectionID: string }>();
  return usePagination({
    queryKey: queryKeys.section.labs.allWithParams(sectionID, params),
    queryFn: ({ pageParam }) =>
      cmsSectionService.getLabsPagination(sectionID, {
        ...params,
        page: pageParam,
      }),
  });
};

export default useLabPagination;
