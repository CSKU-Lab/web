"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ServerCrash, Star } from "lucide-react";
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

import LabCard from "./LabCard";
import CreateLabDialog from "./CreateLabDialog";
import Loading from "~/components/commons/Loading";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import SearchInput from "~/components/commons/SearchInput";
import { Skeleton } from "~/components/ui/skeleton";
import useInputDebounce from "~/hooks/useInputDebounce";
import useLabPagination from "../_hooks/useLabPagination";
import useDefaultLabPagination from "../_hooks/useDefaultLabPagination";
import type { CMSLab } from "~/types/cms-lab";
import type { CMSDefaultLab } from "~/types/cms-default-lab";
import {
  cmsDefaultLabService,
  type UpdateDefaultLabParams,
} from "~/services/cms-default-lab.service";

export default function LabCardList() {
  const { courseID } = useParams<{ courseID: string }>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);
  const [rows, setRows] = useState<CMSLab[]>([]);
  const [defaultLabRows, setDefaultLabRows] = useState<CMSDefaultLab[]>([]);
  const previousDefaultRowsRef = useRef<CMSDefaultLab[]>([]);

  const {
    data: labPagination,
    isFetching,
    isError,
    refetch,
  } = useLabPagination({
    course_id: courseID!,
    args: {
      page: 1,
      page_size: 50,
      search: debouncedSearch,
      sort_by: "created_at",
      sort_order: "desc",
      filters: [],
    },
  });

  const {
    data: defaultLabPagination,
    isFetching: isDefaultFetching,
    isError: isDefaultError,
    refetch: refetchDefault,
  } = useDefaultLabPagination({
    course_id: courseID!,
    args: {
      page: 1,
      page_size: -1,
      search: "",
      sort_by: "position",
      sort_order: "asc",
      filters: [],
    },
  });

  useEffect(() => {
    if (labPagination?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRows(labPagination.data);
    }
  }, [labPagination?.data]);

  useEffect(() => {
    if (defaultLabPagination?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDefaultLabRows(defaultLabPagination.data);
    }
  }, [defaultLabPagination?.data]);

  const defaultLabIds = useMemo(
    () => new Set(defaultLabRows.map((d) => d.lab_id)),
    [defaultLabRows],
  );

  const defaultLabPositions = useMemo(
    () => {
      const map = new Map<string, number>();
      defaultLabRows.forEach((d) => map.set(d.lab_id, d.position));
      return map;
    },
    [defaultLabRows],
  );

  const handleToggle = (labId: string, isDefault: boolean) => {
    if (isDefault) {
      const lab = rows.find((l) => l.id === labId);
      if (lab) {
        const newPosition = defaultLabRows.length + 1;
        setDefaultLabRows((prev) => [
          ...prev,
          {
            id: "",
            course_id: courseID,
            lab_id: lab.id,
            lab_name: lab.display_name,
            position: newPosition,
            created_at: new Date(),
          },
        ]);
      }
    } else {
      setDefaultLabRows((prev) => prev.filter((d) => d.lab_id !== labId));
    }
  };

  const sortableIds = useMemo(
    () => defaultLabRows.map((r) => r.lab_id),
    [defaultLabRows],
  );

  const defaultLabs = useMemo(
    () => {
      const labs = rows.filter((lab) => defaultLabIds.has(lab.id));
      return labs.sort((a, b) => {
        const posA = defaultLabPositions.get(a.id) ?? 999;
        const posB = defaultLabPositions.get(b.id) ?? 999;
        return posA - posB;
      });
    },
    [rows, defaultLabIds, defaultLabPositions],
  );

  const nonDefaultLabs = useMemo(
    () => rows.filter((lab) => !defaultLabIds.has(lab.id)),
    [rows, defaultLabIds],
  );

  const isNoData = rows.length === 0 && !isFetching;
  const isSearchNoData = search.length > 0 && isNoData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const updateDefaultLab = useMutation({
    mutationFn: async (params: UpdateDefaultLabParams) =>
      cmsDefaultLabService.update(params),
    onError: () => {
      setDefaultLabRows(previousDefaultRowsRef.current);
      toast.error("Failed to update Default Lab order");
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (updateDefaultLab.isPending) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = defaultLabRows.findIndex((r) => r.lab_id === active.id);
    const newIndex = defaultLabRows.findIndex((r) => r.lab_id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    previousDefaultRowsRef.current = defaultLabRows;
    const nextRows = arrayMove(defaultLabRows, oldIndex, newIndex);
    const updatedRows = nextRows.map((row, i) => ({
      ...row,
      position: i + 1,
    }));
    setDefaultLabRows(updatedRows);

    updateDefaultLab.mutate({
      courseID,
      payload: {
        lab_id: active.id as string,
        position: newIndex + 1,
      },
    });
  };

  const isCombinedError = isError && !isFetching;
  const isAnyFetching = isFetching || isDefaultFetching;

  return (
    <>
      <div className="@container flex flex-col h-full px-4">
        <div className="flex justify-end items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search labs..."
          />
          <CreateLabDialog />
        </div>

        <Error
          isError={isCombinedError}
          fallback={
            <ErrorFallback
              icon={<ServerCrash size="2rem" />}
              onRetry={() => {
                refetch();
                refetchDefault();
              }}
              title="Cannot get the labs"
              message="There was an error getting the labs. Please try again later or report the issue."
            />
          }
        >
          {isNoData || isSearchNoData ? (
            <NoDataAvailable />
          ) : (
            <>
              {defaultLabRows.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={16} className="text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold">Default Labs</h2>
                    <span className="text-sm text-(--gray-10)">
                      (Drag to reorder, applied when creating new sections)
                    </span>
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sortableIds}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-max">
                        {defaultLabs.map((lab) => (
                          <LabCard
                            key={lab.id}
                            lab={lab}
                            courseID={courseID}
                            isDefault={true}
                            isOrderable={true}
                            onToggle={handleToggle}
                          />
                        ))}
                        <Loading
                          isLoading={isDefaultFetching}
                          fallback={Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-40 rounded-md" />
                          ))}
                        />
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              <div className="mt-6">
                {defaultLabRows.length > 0 && (
                  <h2 className="text-lg font-semibold mb-3">All Labs</h2>
                )}
                <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-max">
                  {nonDefaultLabs.map((lab) => (
                    <LabCard
                      key={lab.id}
                      lab={lab}
                      courseID={courseID}
                      isDefault={false}
                      isOrderable={false}
                      onToggle={handleToggle}
                    />
                  ))}
                  <Loading
                    isLoading={isFetching}
                    fallback={Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton key={index} className="h-40 rounded-md" />
                    ))}
                  />
                </div>
              </div>
            </>
          )}
        </Error>
      </div>
    </>
  );
}