"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { Skeleton } from "~/components/ui/skeleton";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import { ServerCrash } from "lucide-react";
import DetailSection from "./_components/DetailSection";
import RunnerEditor from "./_components/RunnerEditor";
import useRunner from "./_hooks/useRunner";
import {
  runnerNameAtom,
  runnerDescriptionAtom,
} from "./_stores/runner-info.store";
import { saveStatusAtom } from "./_stores/save-status.store";
import type { Runner } from "~/types/cms-runner";

function RunnerDetailPage() {
  const { data: runner, isLoading, isError, refetch } = useRunner();
  const setName = useSetAtom(runnerNameAtom);
  const setDescription = useSetAtom(runnerDescriptionAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);

  // Track previous runner for initialization without useEffect
  const [previousRunner, setPreviousRunner] = useState<Runner | undefined>(undefined);

  // Initialize runner info atoms when data arrives
  if (runner && previousRunner !== runner) {
    setName(runner.name);
    setDescription(runner.description || "");
    setSaveStatus("Saved");
    setPreviousRunner(runner);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="border pl-4 pr-2 py-3 mt-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="flex-1 flex mt-4">
          <Skeleton className="w-60 h-full" />
          <div className="flex-1 p-4">
            <Skeleton className="h-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Error
      isError={isError}
      fallback={
        <ErrorFallback
          icon={<ServerCrash size="2rem" />}
          onRetry={refetch}
          title="Cannot load runner"
          message="There was an error loading the runner. Please try again later or report the issue."
        />
      }
    >
      <div className="flex flex-col h-full">
        <DetailSection />
        <RunnerEditor />
      </div>
    </Error>
  );
}

export default RunnerDetailPage;
