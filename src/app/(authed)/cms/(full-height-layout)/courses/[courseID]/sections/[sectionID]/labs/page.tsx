"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, ServerCrash } from "lucide-react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import RouteNavigation from "../_components/RouteNavigation";
import LabCard from "./_components/LabCard";
import AddLabDialog from "./_components/AddLabDialog";
import useLabInfinitePagination from "./_hooks/useLabInfinitePagination";

import { Button } from "~/components/commons/Button";
import SearchInput from "~/components/commons/SearchInput";
import Loading from "~/components/commons/Loading";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { Skeleton } from "~/components/ui/skeleton";
import useInputDebounce from "~/hooks/useInputDebounce";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { cmsSectionService } from "~/services/cms-section.service";
import type { CMSSectionLab } from "~/types/cms-section-lab";

function SectionLabPage() {
  const { courseID, sectionID } = useParams<{
    courseID: string;
    sectionID: string;
  }>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [rows, setRows] = useState<CMSSectionLab[]>([]);
  const previousRowsRef = useRef<CMSSectionLab[]>([]);

  const {
    data: labPagination,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useLabInfinitePagination(sectionID, {
    page_size: 12,
    search: debouncedSearch,
    sort_by: "position",
    sort_order: "asc",
  });

  // Flatten all pages into a single rows array for DnD
  useEffect(() => {
    const allLabs = labPagination.pages.flatMap((page) => page.data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRows(allLabs);
  }, [labPagination.pages, isFetching]);

  const existingLabIds = useMemo(
    () => new Set(rows.map((lab) => lab.lab_id)),
    [rows],
  );

  const sortableIds = useMemo(() => rows.map((r) => r.lab_id), [rows]);

  const isNoData = rows.length === 0 && !isFetching;
  const isSearchNoData = search.length > 0 && isNoData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const updateSectionLabPosition = useMutation({
    mutationFn: async ({
      labID,
      position,
    }: {
      labID: string;
      position: number;
    }) =>
      cmsSectionService.updateSectionLabPosition(sectionID, labID, position),
    onError: (err) => {
      setRows(previousRowsRef.current);
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description:
            err.response?.data?.error || "Failed to update lab order",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (updateSectionLabPosition.isPending) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.lab_id === active.id);
    const newIndex = rows.findIndex((r) => r.lab_id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    previousRowsRef.current = rows;

    const reorderedRows = arrayMove(rows, oldIndex, newIndex);
    const updatedRows = reorderedRows.map((row, i) => ({
      ...row,
      position: i + 1,
    }));
    setRows(updatedRows);

    updateSectionLabPosition.mutate({
      labID: active.id as string,
      position: newIndex + 1,
    });
  };

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <>
      <RouteNavigation title="Labs" />
      <div className="@container flex flex-col h-full px-4">
        <div className="flex justify-end items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search labs..."
          />
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="my-4 shrink-0 px-3 py-1.5"
          >
            <Plus size="1rem" />
            New lab
          </Button>
        </div>

        <AddLabDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          courseID={courseID}
          existingLabIds={existingLabIds}
          onLabAdded={refetch}
        />

        <Error
          isError={isError && !isFetching}
          fallback={
            <ErrorFallback
              icon={<ServerCrash size="2rem" />}
              onRetry={refetch}
              title="Cannot get the labs"
              message="There was an error getting the labs. Please try again later or report the issue."
            />
          }
        >
          {isNoData || isSearchNoData ? (
            <NoDataAvailable />
          ) : (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortableIds}
                  strategy={rectSortingStrategy}
                >
                  <div className="mt-4 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-max">
                    {rows.map((lab) => (
                      <LabCard
                        key={lab.lab_id}
                        lab={lab}
                        courseID={courseID}
                        sectionID={sectionID}
                      />
                    ))}
                    <Loading
                      isLoading={isFetching}
                      fallback={Array.from({ length: 12 }).map((_, index) => (
                        <Skeleton key={index} className="h-52 rounded-md" />
                      ))}
                    />
                  </div>
                </SortableContext>
              </DndContext>
              <div ref={bottomDivRef} className="h-20" />
            </>
          )}
        </Error>
      </div>
    </>
  );
}

export default SectionLabPage;
