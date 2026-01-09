import { Skeleton } from "~/components/ui/skeleton";
import React from "react";
import BackButton from "./BackButton";
import TestcaseTable from "./TestcaseTable";

function Loading() {
  return (
    <>
      <BackButton />
      <Skeleton className="w-full h-24" />

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-14 h-8" />
      </div>
      <Skeleton className="w-full h-64 mt-4" />

      <Skeleton className="w-20 h-8 mt-4" />
      <TestcaseTable isLoading />
    </>
  );
}

export default Loading;
