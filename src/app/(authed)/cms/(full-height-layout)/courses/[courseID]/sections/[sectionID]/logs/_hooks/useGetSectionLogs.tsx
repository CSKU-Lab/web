import { useParams } from "next/navigation";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  cmsSectionService,
  type GetSectionLogPaginationParams,
} from "~/services/cms-section.service";

function useGetSectionLogs(args: GetSectionLogPaginationParams) {
  const { sectionID } = useParams<{ sectionID: string }>();
  return useInfinitePagination({
    queryKey: queryKeys.section.logs.allWithParams(sectionID, args),
    queryFn: ({ pageParam }) =>
      cmsSectionService.getLogsPagination(sectionID, {
        ...args,
        page: pageParam,
      }),
  });
}

export default useGetSectionLogs;
