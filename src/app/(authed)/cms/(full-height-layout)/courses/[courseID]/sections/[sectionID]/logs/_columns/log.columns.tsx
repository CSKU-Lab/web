import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { CMSSectionLog } from "~/types/cms-section-logs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const columnHelper = createColumnHelper<CMSSectionLog>();

export const logColumns: ColumnDef<CMSSectionLog, any>[] = [
  columnHelper.accessor("timestamp", {
    header: () => <h6>Time</h6>,
    cell: ({ cell }) => {
      const date = dayjs(cell.getValue());
      const diffDays = dayjs(cell.getValue()).diff(dayjs(), "day");

      if (diffDays <= 1) {
        return <h6>{date.fromNow()}</h6>;
      }
    },
  }),
  columnHelper.accessor("action", {
    header: () => <h6>Action</h6>,
    cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
  }),
  columnHelper.accessor("user", {
    header: () => <h6>User</h6>,
    cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
  }),
  columnHelper.accessor("details", {
    header: () => <h6>Details</h6>,
    cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
  }),
];
