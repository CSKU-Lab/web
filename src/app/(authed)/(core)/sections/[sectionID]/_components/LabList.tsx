"use client";
import { LabItem } from "./LabItem";
import useCoreLabInfPagination from "../_hooks/useCoreLabInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { LabItemSkeleton } from "./LabItemSkeleton";

export default function LabList() {
  const {
    data: labPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useCoreLabInfPagination({
    page_size: 5,
    sort_by: "position",
    sort_order: "asc",
    filters: [],
  });

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-6 gap-6">
      {labPagination.pages.map((page) =>
        page.data.map(({ id, lab_name, lab_id }) => (
          <LabItem key={id} id={lab_id} name={lab_name}>
            <div className="flex flex-col text-xs mt-4">
              <p>Posted: 04/12/2025</p>
              <p>Due date: 12/12/2025</p>
            </div>
          </LabItem>
        )),
      )}

      {isFetching &&
        Array.from({ length: 3 }).map((_, index) => (
          <LabItemSkeleton key={`skeleton-${index}`} />
        ))}

      <div ref={bottomDivRef} className="h-20" />
    </div>
  );
}
