"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Eye, Pencil, Plus, ServerCrash } from "lucide-react";
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

import RouteNavigation from "~/features/cms/sections/components/RouteNavigation";
import LabCard from "~/features/cms/sections/components/labs/LabCard";
import AddLabDialog from "~/features/cms/sections/components/labs/AddLabDialog";
import useLabInfinitePagination from "~/features/cms/sections/hooks/labs/useLabInfinitePagination";

import { Button } from "~/components/commons/Button";
import SearchInput from "~/components/commons/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import Loading from "~/components/commons/Loading";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { Skeleton } from "~/components/ui/skeleton";
import useInputDebounce from "~/hooks/useInputDebounce";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { cmsSectionService } from "~/services/cms-section.service";
import type { CMSSectionLab, LabStatus } from "~/types/cms-section-lab";

const LAB_STATUSES: { value: LabStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "readonly", label: "Readonly" },
  { value: "hidden", label: "Hidden" },
  { value: "disabled", label: "Disabled" },
];

function SectionLabsView() {
  const { courseID, sectionID } = useParams<{
    courseID: string;
    sectionID: string;
  }>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [rows, setRows] = useState<CMSSectionLab[]>([]);
  const previousRowsRef = useRef<CMSSectionLab[]>([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLabIds, setSelectedLabIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<LabStatus | "">("");

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

  const bulkUpdateStatus = useMutation({
    mutationFn: async (status: LabStatus) => {
      const now = new Date().toISOString();
      const payload = {
        status,
        opened_at: status === "open" ? now : null,
        readonly_at: status === "readonly" ? now : null,
      };
      await Promise.all(
        Array.from(selectedLabIds).map((labID) =>
          cmsSectionService.updateSectionLab(sectionID, labID, payload),
        ),
      );
    },
    onSuccess: async () => {
      toast.success("Status updated");
      setSelectedLabIds(new Set());
      setBulkStatus("");
      await refetch();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to update status",
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

  const handleToggleSelect = useCallback((labId: string) => {
    setSelectedLabIds((prev) => {
      const next = new Set(prev);
      if (next.has(labId)) {
        next.delete(labId);
      } else {
        next.add(labId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = () => {
    if (selectedLabIds.size === rows.length) {
      setSelectedLabIds(new Set());
    } else {
      setSelectedLabIds(new Set(rows.map((r) => r.lab_id)));
    }
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
    setSelectedLabIds(new Set());
    setBulkStatus("");
  };

  const handleApplyBulkStatus = () => {
    if (!bulkStatus || selectedLabIds.size === 0) return;
    bulkUpdateStatus.mutate(bulkStatus);
  };

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  const allSelected = rows.length > 0 && selectedLabIds.size === rows.length;

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
          {!isEditMode ? (
            <>
              <Button
                onClick={() => setIsEditMode(true)}
                className="my-4 shrink-0 px-3 py-1.5"
              >
                <Pencil size="1rem" />
                Edit
              </Button>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="my-4 shrink-0 px-3 py-1.5"
              >
                <Plus size="1rem" />
                Add lab to section
              </Button>
            </>
          ) : (
            <Button
              onClick={handleExitEditMode}
              className="my-4 shrink-0 px-3 py-1.5"
            >
              <Eye size="1rem" />
              View
            </Button>
          )}
        </div>

        {isEditMode && (
          <div className="flex items-center gap-3 mb-3 py-2 px-3 rounded-md bg-(--gray-2) border border-(--gray-4)">
            <button
              type="button"
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm text-(--gray-11) hover:text-(--gray-12) transition-colors"
            >
              <input
                type="checkbox"
                readOnly
                checked={allSelected}
                ref={(el) => {
                  if (el) {
                    el.indeterminate =
                      selectedLabIds.size > 0 && !allSelected;
                  }
                }}
                className="pointer-events-none h-3.5 w-3.5 accent-(--gray-12)"
              />
              {allSelected ? "Deselect all" : "Select all"}
            </button>
            <span className="text-sm text-(--gray-9)">
              {selectedLabIds.size} selected
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Select
                value={bulkStatus}
                onValueChange={(v) => setBulkStatus(v as LabStatus)}
              >
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  {LAB_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="h-8 px-3 py-1 text-xs"
                disabled={
                  !bulkStatus ||
                  selectedLabIds.size === 0 ||
                  bulkUpdateStatus.isPending
                }
                onClick={handleApplyBulkStatus}
              >
                Apply
              </Button>
            </div>
          </div>
        )}

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
                onDragEnd={isEditMode ? handleDragEnd : undefined}
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
                        isEditMode={isEditMode}
                        isSelected={selectedLabIds.has(lab.lab_id)}
                        onToggleSelect={handleToggleSelect}
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

export default SectionLabsView;
