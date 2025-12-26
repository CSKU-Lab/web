import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { CMSGradebook } from "~/types/cms-section-gradebook";

const columnHelper = createColumnHelper<CMSGradebook>();

export const columns: ColumnDef<CMSGradebook, any>[] = [
  columnHelper.group({
    header: "Students/Labs",
    columns: [
      columnHelper.accessor("username", {
        header: () => <h6>Username</h6>,
        cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
      }),
      columnHelper.accessor("display_name", {
        header: () => <h6>Display Name</h6>,
        cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
      }),
    ],
  }),
  ...[
    "Lab 01",
    "Lab 02",
    "Lab 03",
    "Lab 04",
    "Lab 05",
    "Lab 06",
    "Lab 07",
    "Lab 08",
    "Lab 09",
    "Lab 10",
  ].map((labName) =>
    columnHelper.group({
      header: labName,
      columns: [
        columnHelper.accessor(
          (row) => {
            const lab = row.labs.find((lab) => lab.name === labName);
            return lab ? lab.auto_score : 0;
          },
          {
            id: `${labName}-auto-score`,
            header: () => <h6>Auto (8)</h6>,
            cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
          },
        ),
        columnHelper.accessor(
          (row) => {
            const lab = row.labs.find((lab) => lab.name === labName);
            return lab ? lab.manual_score : 0;
          },
          {
            id: `${labName}-manual-score`,
            header: () => <h6>Manual (4)</h6>,
            cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
          },
        ),
        columnHelper.accessor(
          (row) => {
            const lab = row.labs.find((lab) => lab.name === labName);
            return lab ? lab.total_score : 0;
          },
          {
            id: `${labName}-total-score`,
            header: () => <h6>Total (12)</h6>,
            cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
          },
        ),
      ],
    }),
  ),
];
