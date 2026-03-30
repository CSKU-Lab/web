"use client";

import { useAtom } from "jotai";
import { FileCode, FileText, Terminal, Calendar, Hash } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import Loading from "~/components/commons/Loading";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import { ServerCrash } from "lucide-react";
import CodeDiff from "./CodeDiff";
import { useRunnerDetail } from "../_hooks/useRunnerComparison";
import {
  leftRunnerAtom,
  rightRunnerAtom,
} from "../_stores/comparison.store";
import type { RunnerConfigDetail } from "~/types/cms-runner";

interface DetailItemProps {
  label: string;
  leftValue: React.ReactNode;
  rightValue: React.ReactNode;
  icon?: React.ReactNode;
}

function DetailItem({ label, leftValue, rightValue, icon }: DetailItemProps) {
  return (
    <div className="grid grid-cols-2 gap-0 border-b border-(--gray-6) last:border-b-0">
      <div className="px-4 py-3 border-r border-(--gray-6)">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-(--gray-9)">{icon}</span>}
          <span className="text-xs text-(--gray-9) uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className="text-sm text-(--gray-12)">{leftValue}</div>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-(--gray-9)">{icon}</span>}
          <span className="text-xs text-(--gray-9) uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className="text-sm text-(--gray-12)">{rightValue}</div>
      </div>
    </div>
  );
}

interface ComparisonViewProps {
  leftRunner: RunnerConfigDetail;
  rightRunner: RunnerConfigDetail;
}

function RunnerComparisonContent({ leftRunner, rightRunner }: ComparisonViewProps) {
  // Combine initial files from both runners
  const allFileNames = new Set([
    ...leftRunner.initial_files.map(f => f.name),
    ...rightRunner.initial_files.map(f => f.name),
  ]);

  const sortedFileNames = Array.from(allFileNames).sort();

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="border border-(--gray-6) rounded-md overflow-hidden">
        <div className="px-4 py-2 bg-(--gray-2) border-b border-(--gray-6)">
          <h3 className="text-sm font-medium text-(--gray-12)">
            Basic Information
          </h3>
        </div>

        <DetailItem
          label="Name"
          icon={<Terminal size="0.875rem" />}
          leftValue={leftRunner.name}
          rightValue={rightRunner.name}
        />

        <DetailItem
          label="Description"
          icon={<FileText size="0.875rem" />}
          leftValue={
            leftRunner.description || (
              <span className="text-(--gray-9) italic">No description</span>
            )
          }
          rightValue={
            rightRunner.description || (
              <span className="text-(--gray-9) italic">No description</span>
            )
          }
        />

        <DetailItem
          label="ID"
          icon={<Hash size="0.875rem" />}
          leftValue={<span className="text-xs font-mono text-(--gray-11)">{leftRunner.id}</span>}
          rightValue={<span className="text-xs font-mono text-(--gray-11)">{rightRunner.id}</span>}
        />

        <DetailItem
          label="Created At"
          icon={<Calendar size="0.875rem" />}
          leftValue={new Date(leftRunner.created_at).toLocaleString()}
          rightValue={new Date(rightRunner.created_at).toLocaleString()}
        />

        <DetailItem
          label="Updated At"
          icon={<Calendar size="0.875rem" />}
          leftValue={new Date(leftRunner.updated_at).toLocaleString()}
          rightValue={new Date(rightRunner.updated_at).toLocaleString()}
        />
      </div>

      {/* Scripts Comparison */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileCode size="1rem" className="text-(--gray-11)" />
          <h3 className="text-sm font-medium text-(--gray-12)">Scripts</h3>
        </div>

        <CodeDiff
          leftContent={leftRunner.build_script}
          rightContent={rightRunner.build_script}
          leftLabel="Runner A - Build Script"
          rightLabel="Runner B - Build Script"
          fileName="build_script.sh"
          extension="sh"
        />

        <CodeDiff
          leftContent={leftRunner.run_script}
          rightContent={rightRunner.run_script}
          leftLabel="Runner A - Run Script"
          rightLabel="Runner B - Run Script"
          fileName="run_script.sh"
          extension="sh"
        />
      </div>

      {/* Initial Files Comparison */}
      {sortedFileNames.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileCode size="1rem" className="text-(--gray-11)" />
            <h3 className="text-sm font-medium text-(--gray-12)">
              Initial Files ({sortedFileNames.length})
            </h3>
          </div>

          {sortedFileNames.map((fileName) => {
            const leftFile = leftRunner.initial_files.find(f => f.name === fileName);
            const rightFile = rightRunner.initial_files.find(f => f.name === fileName);
            
            return (
              <CodeDiff
                key={fileName}
                leftContent={leftFile?.content || ""}
                rightContent={rightFile?.content || ""}
                leftLabel={`Runner A - ${fileName}`}
                rightLabel={`Runner B - ${fileName}`}
                fileName={fileName}
                extension={fileName.split(".").pop() || "txt"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ComparisonView() {
  const [leftRunner] = useAtom(leftRunnerAtom);
  const [rightRunner] = useAtom(rightRunnerAtom);

  const {
    data: leftRunnerDetail,
    isLoading: isLeftLoading,
    isError: isLeftError,
    refetch: refetchLeft,
  } = useRunnerDetail(leftRunner?.id ?? null);

  const {
    data: rightRunnerDetail,
    isLoading: isRightLoading,
    isError: isRightError,
    refetch: refetchRight,
  } = useRunnerDetail(rightRunner?.id ?? null);

  const isLoading = isLeftLoading || isRightLoading;
  const isError = isLeftError || isRightError;

  if (!leftRunner && !rightRunner) {
    return null;
  }

  return (
    <Error
      isError={isError}
      fallback={
        <ErrorFallback
          icon={<ServerCrash size="2rem" />}
          onRetry={() => {
            if (isLeftError) refetchLeft();
            if (isRightError) refetchRight();
          }}
          title="Cannot load runner details"
          message="There was an error loading the runner details. Please try again later or report the issue."
        />
      }
    >
      <Loading
        isLoading={isLoading}
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        }
      >
        {leftRunnerDetail && rightRunnerDetail && (
          <div className="space-y-6">
            {/* Side-by-side comparison header */}
            <div className="grid grid-cols-2 gap-4 border-b border-(--gray-6) pb-4">
              <div className="px-4 py-3 bg-(--gray-2) rounded-md border border-(--gray-6)">
                <div className="flex items-center gap-2">
                  <Terminal size="1rem" className="text-emerald-500" />
                  <span className="font-medium text-(--gray-12)">
                    {leftRunnerDetail.name}
                  </span>
                </div>
                <p className="text-xs text-(--gray-9) mt-1">Runner A</p>
              </div>
              <div className="px-4 py-3 bg-(--gray-2) rounded-md border border-(--gray-6)">
                <div className="flex items-center gap-2">
                  <Terminal size="1rem" className="text-emerald-500" />
                  <span className="font-medium text-(--gray-12)">
                    {rightRunnerDetail.name}
                  </span>
                </div>
                <p className="text-xs text-(--gray-9) mt-1">Runner B</p>
              </div>
            </div>

            {/* Comparison content */}
            <RunnerComparisonContent 
              leftRunner={leftRunnerDetail} 
              rightRunner={rightRunnerDetail} 
            />
          </div>
        )}
      </Loading>
    </Error>
  );
}

export default ComparisonView;
