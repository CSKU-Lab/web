"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { Skeleton } from "~/components/ui/skeleton";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import { ServerCrash } from "lucide-react";
import DetailSection from "./DetailSection";
import RunnerEditor from "./RunnerEditor";
import useRunner from "../hooks/useRunner";
import {
  runnerNameAtom,
  runnerDescriptionAtom,
} from "../stores/runner-info.store";
import { saveStatusAtom } from "../stores/save-status.store";
import { runnerFilesAtom } from "../stores/runner-files.store";
import type { CodeFile } from "~/types/code-material";

interface RunnerDetailViewProps {
  runnerId: string;
}

function RunnerDetailView({ runnerId }: RunnerDetailViewProps) {
  const { data: runner, isLoading, isError, refetch } = useRunner(runnerId);
  const setName = useSetAtom(runnerNameAtom);
  const setDescription = useSetAtom(runnerDescriptionAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const setFiles = useSetAtom(runnerFilesAtom);
  const [initialRender, setInitialRender] = useState(true);

  if (runner && initialRender) {
    setName(runner.name);
    setDescription(runner.description || "");
    setSaveStatus("Saved");

    const files: CodeFile[] = [
      {
        name: "scripts/build_script.sh",
        content: runner.build_script,
      },
      {
        name: "scripts/run_script.sh",
        content: runner.run_script,
      },
    ];

    runner.initial_files.forEach((file) => {
      files.push({
        name: `initial/${file.name}`,
        content: file.content,
      });
    });
    setFiles(files);
    setInitialRender(false);
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
      <div className="flex flex-col h-full border mt-4">
        <DetailSection />
        <RunnerEditor />
      </div>
    </Error>
  );
}

export default RunnerDetailView;
