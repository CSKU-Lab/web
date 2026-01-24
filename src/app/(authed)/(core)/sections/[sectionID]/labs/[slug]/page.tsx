"use client";
import PageTitle from "~/components/commons/PageTitle";
import { MaterialPieChart } from "../_components/MaterialPieChart";
import MaterialInfList from "../_components/MaterialInfList";
import useCoreLab from "../_hooks/useCoreLab";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { Skeleton } from "~/components/ui/skeleton";
import { notFound } from "next/navigation";

export default function LabPage() {
  const { useGetLabDetail } = useCoreLab();
  const { data: labDetail, isLoading, isError } = useGetLabDetail();

  if (isError) {
    return notFound();
  }

  return (
    <div className="p-4 grid grid-cols-4 min-h-[100vh] h-full gap-6">
      <div className="flex flex-col h-fit shadow-md rounded-lg p-6 gap-6">
        <div className="flex flex-col gap-6 items-center h-full w-full">
          <div className="flex flex-col text-xl gap-4 w-full">
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </>
              ) : (
                <>
                  <h2 className="font-bold">{labDetail?.display_name}</h2>
                  <p className="text-xs">
                    Posted: {dateFormatter(labDetail?.created_at ?? "") ?? ""}
                  </p>
                  <p className="text-xs">Due date: 12/12/2025</p>
                </>
              )}
            </div>
          </div>

          <hr className="w-full" />

          <div className="aspect-square h-full my-6 max-h-[15rem] w-full flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="h-full rounded-full aspect-square" />
            ) : (
              <MaterialPieChart totalMaterials={300} completedMaterials={43} />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full flex-1 col-span-3">
        <PageTitle>Materials</PageTitle>

        <div className="flex flex-col h-full flex-1 gap-4">
          <MaterialInfList />
        </div>
      </div>
    </div>
  );
}
