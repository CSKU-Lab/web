import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";
import {
  CMSLabStatusMaterial,
  CMSLabStatusStudent,
  CMSLabStatusSubmission,
} from "~/types/cms-lab-status";

const columnHelper = createColumnHelper<CMSLabStatusStudent>();

const statusColors: Record<CMSLabStatusSubmission["status"], string> = {
  passed: "bg-(--grass-9)",
  failed: "bg-(--tomato-9)",
  not_submitted: "bg-(--gray-4)",
};

const formatFullDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function getStatusColumns(
  baseUrl: string,
  materials: CMSLabStatusMaterial[],
): ColumnDef<CMSLabStatusStudent, any>[] {
  return [
    columnHelper.group({
      id: "students",
      header: "Students",
      columns: [
        columnHelper.accessor("username", {
          header: () => <h6 className="text-left">Username</h6>,
          cell: ({ getValue }) => (
            <h6 className="font-medium text-left">{getValue()}</h6>
          ),
          size: 120,
        }),
        columnHelper.accessor("display_name", {
          header: () => <h6 className="text-left">Display Name</h6>,
          cell: ({ getValue }) => (
            <h6 className="text-left text-(--gray-11)">{getValue()}</h6>
          ),
          size: 150,
        }),
      ],
    }),
    columnHelper.group({
      id: "materials",
      header: "Materials",
      columns: materials.map((material) =>
        columnHelper.accessor(
          (row) =>
            row.material_statuses[material.material_id] ?? {
              status: "not_submitted",
            },
          {
            id: material.material_id,
            header: () => (
              <div className="text-center">
                <h6 className="text-xs">{material.material_name}</h6>
              </div>
            ),
            cell: ({ row }) => {
              const submission = row.original.material_statuses[
                material.material_id
              ] as CMSLabStatusSubmission;

              let render = (
                <div className="flex items-center justify-center">
                  <Link
                    href={`${baseUrl}/materials/${material.material_id}/submissions?student_id=${row.original.id}`}
                  >
                    <div
                      className={`size-4 rounded-sm ${statusColors[submission.status]}`}
                    ></div>
                  </Link>
                </div>
              );

              if (
                submission.status !== "not_submitted" &&
                submission.submitted_at
              ) {
                const tooltipText = `${submission.status === "passed" ? "Passed" : "Failed"} - ${formatFullDateTime(submission.submitted_at)}`;
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>{render}</TooltipTrigger>
                    <TooltipContent>{tooltipText}</TooltipContent>
                  </Tooltip>
                );
              }

              return render;
            },
            size: 80,
          },
        ),
      ),
    }),
  ];
}
