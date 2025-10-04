"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/commons/DropDownMenu";
import type { Column } from "@tanstack/react-table";
import type { User } from "~/types/user";

interface Props {
  columns: Column<User>[];
}

function FilterColumns({ columns }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-1.5 border border-(--gray-6) bg-(--gray-2) text-(--gray-11) text-xs rounded-md flex justify-center items-center gap-1.5 hover:bg-(--gray-3) disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-(--gray-7) focus:ring-offset-2 transition-colors">
        <SlidersHorizontal size="1rem" />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            className="flex items-center gap-2"
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FilterColumns;
