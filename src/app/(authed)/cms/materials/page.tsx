"use client";
import { useMemo } from "react";
import useTable from "~/hooks/useTable";
import { columns } from "./_columns";
import DataTable from "~/components/commons/DataTable";
import { Button } from "~/components/commons/Button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import PageTitle from "~/components/commons/PageTitle";

function MaterialPage() {
  const memoizedColumns = useMemo(() => columns, []);

  const table = useTable({
    data: [],
    columns: memoizedColumns,
    totalCount: 0,
    state: {},
  });

  const router = useRouter();

  return (
    <div>
      <PageTitle>Materials</PageTitle>
      <div className="flex justify-end px-4">
        <Button
          onClick={() => router.push("/cms/materials/new")}
          className="my-4 shrink-0 px-3 py-1.5"
        >
          <Plus size="1rem" />
          New material
        </Button>
      </div>

      <DataTable table={table} />
    </div>
  );
}

export default MaterialPage;
