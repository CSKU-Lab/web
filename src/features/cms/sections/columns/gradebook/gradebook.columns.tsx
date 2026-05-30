import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { StudentRow, LabCol } from "~/types/cms-section-gradebook";

const columnHelper = createColumnHelper<StudentRow>();

function getLabScore(
  lab_scores: StudentRow["lab_scores"],
  lab_id: string,
  scoreType: "auto_score" | "manual_score"
): number {
  return lab_scores[lab_id]?.[scoreType] ?? 0;
}

export function getGradebookColumns(lab_cols: LabCol[]): ColumnDef<StudentRow, any>[] {
  return [
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
    ...lab_cols.map((lab) =>
      columnHelper.group({
        header: lab.lab_name,
        columns: [
          columnHelper.accessor(
            (row) => getLabScore(row.lab_scores, lab.lab_id, "auto_score"),
            {
              id: `${lab.lab_id}-auto-score`,
              header: () => <h6>Auto ({lab.max_auto_score})</h6>,
              cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
            }
          ),
          columnHelper.accessor(
            (row) => getLabScore(row.lab_scores, lab.lab_id, "manual_score"),
            {
              id: `${lab.lab_id}-manual-score`,
              header: () => <h6>Manual ({lab.max_manual_score})</h6>,
              cell: ({ cell }) => <h6>{cell.getValue()}</h6>,
            }
          ),
        ],
      })
    ),
  ];
}
