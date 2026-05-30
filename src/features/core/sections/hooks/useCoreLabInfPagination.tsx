import { useParams } from "next/navigation";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  coreSectionService,
  type GetSectionLabPaginationParams,
} from "~/services/core-section.service";

function useCoreLabInfPagination(args: GetSectionLabPaginationParams) {
  const { sectionID } = useParams<{ sectionID: string }>();
  return useInfinitePagination({
    queryKey: queryKeys.section.labs.allWithParams(sectionID, args),
    queryFn: ({ pageParam }) =>
      coreSectionService.getLabsInSectionPagination(sectionID, {
        ...args,
        page: pageParam,
      }),
  });
}

export default useCoreLabInfPagination;
