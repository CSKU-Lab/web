"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Check } from "lucide-react";
import type { CMSLab } from "~/types/cms-lab";
import { cn } from "~/lib/utils";

const columnHelper = createColumnHelper<CMSLab>();

interface AddLabColumnProps {
  existingLabIds: Set<string>;
  selectedLabIds: Set<string>;
  onToggleLab: (labId: string, checked: boolean) => void;
}

export const createAddLabColumns = ({
  existingLabIds,
  selectedLabIds,
  onToggleLab,
}: AddLabColumnProps) =>
  [
    columnHelper.display({
      id: "select",
      header: () => null,
      cell: (cell) => {
        const lab = cell.row.original;
        const isAdded = existingLabIds.has(lab.id);
        const isSelected = selectedLabIds.has(lab.id);

        return (
          <input
            type="checkbox"
            checked={isSelected}
            disabled={isAdded}
            onChange={(e) => {
              if (isAdded) return;
              onToggleLab(lab.id, e.target.checked);
            }}
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0",
              isAdded && "opacity-50 cursor-not-allowed",
            )}
          />
        );
      },
      enableSorting: false,
      size: 40,
    }),
    columnHelper.accessor("display_name", {
      id: "display_name",
      header: "Lab Name",
      cell: (cell) => <div className="font-medium">{cell.getValue()}</div>,
    }),
    columnHelper.display({
      id: "status",
      header: "",
      cell: (cell) => {
        const isAdded = existingLabIds.has(cell.row.original.id);
        if (isAdded) {
          return (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Check size={14} />
              <span>Already added</span>
            </div>
          );
        }
        return null;
      },
    }),
  ] as ColumnDef<CMSLab>[];
