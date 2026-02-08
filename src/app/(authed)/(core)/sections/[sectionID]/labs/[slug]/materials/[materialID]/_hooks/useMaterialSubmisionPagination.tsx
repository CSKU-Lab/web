import { useParams } from "next/navigation";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import { queryKeys } from "~/queryKeys";
import {
  coreMaterialService,
  type GetSubmissionPaginationParams,
} from "~/services/core-material.service";

function useMaterialSubmissionPagination<T>(
  params: GetSubmissionPaginationParams<T>,
) {
  const { materialID } = useParams<{ materialID: string }>();

  return useInfinitePagination({
    queryKey: queryKeys.material.core.getById(materialID),
    queryFn: ({ pageParam }) =>
      coreMaterialService.getPagination(materialID, {
        ...params,
        page: pageParam,
      }),
  });
}

export default useMaterialSubmissionPagination;
