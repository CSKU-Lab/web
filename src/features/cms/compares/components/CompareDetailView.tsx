"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { Skeleton } from "~/components/ui/skeleton";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import { ServerCrash } from "lucide-react";
import DetailSection from "./DetailSection";
import CompareEditor from "./CompareEditor";
import useCompare from "../hooks/useCompare";
import {
  compareNameAtom,
  compareDescriptionAtom,
  compareRunNameAtom,
} from "../stores/compare-info.store";
import { saveStatusAtom } from "../stores/save-status.store";
import { compareFilesAtom } from "../stores/compare-files.store";
import type { CodeFile } from "~/components/Editor/types/editor";

interface CompareDetailViewProps {
  compareId: string;
}

function CompareDetailView({ compareId }: CompareDetailViewProps) {
  const { data: compare, isLoading, isError, refetch } = useCompare(compareId);
  const setName = useSetAtom(compareNameAtom);
  const setDescription = useSetAtom(compareDescriptionAtom);
  const setRunName = useSetAtom(compareRunNameAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const setFiles = useSetAtom(compareFilesAtom);
  const [initialRender, setInitialRender] = useState(true);

  if (compare && initialRender) {
    setName(compare.name);
    setDescription(compare.description || "");
    setRunName(compare.run_name);
    setSaveStatus("Saved");

    const files: CodeFile[] = [
      {
        name: "scripts/build_script.sh",
        content: compare.build_script,
      },
      {
        name: "scripts/run_script.sh",
        content: compare.run_script,
      },
    ];

    compare.files.forEach((file) => {
      files.push({
        name: `files/${file.name}`,
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
          title="Cannot load compare"
          message="There was an error loading the compare. Please try again later or report the issue."
        />
      }
    >
      <div className="flex flex-col h-full border mt-4">
        <DetailSection />
        <CompareEditor />
      </div>
    </Error>
  );
}

export default CompareDetailView;
