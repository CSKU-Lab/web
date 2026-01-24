import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  coreSectionService,
  GetSectionPaginationParams,
} from "~/services/core-section.service";

const useCoreSectionInfPagination = (params: GetSectionPaginationParams) => {
  return useInfinitePagination({
    queryKey: queryKeys.section.allWithParams(params),
    queryFn: ({ pageParam }) =>
      coreSectionService.getSectionsPagination({
        ...params,
        page: pageParam,
      }),
  });
};

export default useCoreSectionInfPagination;
