import { useParams } from "next/navigation";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  coreMaterialService,
  type GetSubmissionPaginationParams,
} from "~/services/core-material.service";
import { SUBMISSION_PAGE_SIZE } from "../../_constants/submissions";

function useMaterialSubmissionPagination<T>(
  params: GetSubmissionPaginationParams<T>,
) {
  const { materialID } = useParams<{ materialID: string }>();

  return useInfinitePagination({
    queryKey: queryKeys.core.material.getPagination(materialID),
    queryFn: ({ pageParam }) =>
      coreMaterialService.getPagination(materialID, {
        page_size: SUBMISSION_PAGE_SIZE,
        ...params,
        page: pageParam,
      }),
  });
}

export default useMaterialSubmissionPagination;
