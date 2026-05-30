"use client";

import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/commons/Dialog";
import useInputDebounce from "~/hooks/useInputDebounce";
import useTable from "~/hooks/useTable";
import useTableState from "~/hooks/useTableState";
import DataTable from "~/components/commons/DataTable";
import type { CMSLab } from "~/types/cms-lab";
import useCourseLabPagination from "~/features/cms/sections/hooks/labs/useCourseLabPagination";
import { getCoreRowModel } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { cmsSectionService } from "~/services/cms-section.service";
import { createAddLabColumns } from "~/features/cms/sections/columns/labs/addLab";

interface AddLabDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseID: string;
  existingLabIds: Set<string>;
  onLabAdded: () => void;
}

function AddLabDialog({
  isOpen,
  onClose,
  courseID,
  existingLabIds,
  onLabAdded,
}: AddLabDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedLabIds, setSelectedLabIds] = useState<Set<string>>(new Set());
  const debouncedSearch = useInputDebounce(search, 500);
  const { pagination, setPagination } = useTableState();
  const { sectionID } = useParams<{ sectionID: string }>();

  const {
    data: labPagination,
    isFetching,
    isError,
    refetch,
  } = useCourseLabPagination({
    course_id: courseID,
    args: {
      page: pagination.pageIndex + 1,
      page_size: 10,
      search: debouncedSearch,
      sort_by: "created_at" as keyof CMSLab,
      sort_order: "desc",
    },
  });

  const addLabs = useMutation({
    mutationFn: () => {
      if (!sectionID || selectedLabIds.size === 0)
        throw new Error("Invalid params");
      return cmsSectionService.addLabs(sectionID, Array.from(selectedLabIds));
    },
    onSuccess: () => {
      toast.success("Labs added successfully");
      onLabAdded();
      onClose();
      setSelectedLabIds(new Set());
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to add labs",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleToggleLab = useCallback(
    (labId: string, checked: boolean) => {
      const newSelected = new Set(selectedLabIds);
      if (checked) {
        newSelected.add(labId);
      } else {
        newSelected.delete(labId);
      }
      setSelectedLabIds(newSelected);
    },
    [selectedLabIds],
  );

  const columns = useMemo(
    () =>
      createAddLabColumns({
        existingLabIds,
        selectedLabIds,
        onToggleLab: handleToggleLab,
      }),
    [existingLabIds, selectedLabIds, handleToggleLab],
  );

  const table = useTable({
    data: labPagination.data,
    columns,
    totalCount: 0,
    pageCount: labPagination.pagination.total_page,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    onPaginationChange: setPagination,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="p-4">
          <DialogTitle>Add Lab to Section</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search labs..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <DataTable
              className="rounded-md"
              table={table}
              isError={isError}
              onRetry={refetch}
              isLoading={isFetching}
              totalData={labPagination.pagination.total_rows}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => addLabs.mutate()}
              disabled={selectedLabIds.size === 0 || addLabs.isPending}
              isLoading={addLabs.isPending}
            >
              Add Labs
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddLabDialog;
