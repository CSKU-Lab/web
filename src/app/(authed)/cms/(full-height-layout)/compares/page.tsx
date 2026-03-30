"use client";

import { useAtom } from "jotai";
import { GitCompare, ArrowRightLeft } from "lucide-react";
import PageTitle from "~/components/commons/PageTitle";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { Button } from "~/components/commons/Button";
import RunnerSelector from "./_components/RunnerSelector";
import ComparisonView from "./_components/ComparisonView";
import {
  leftRunnerAtom,
  rightRunnerAtom,
  leftSearchAtom,
  rightSearchAtom,
} from "./_stores/comparison.store";

function RunnerComparePage() {
  const [leftRunner, setLeftRunner] = useAtom(leftRunnerAtom);
  const [rightRunner, setRightRunner] = useAtom(rightRunnerAtom);

  const handleSwap = () => {
    const temp = leftRunner;
    setLeftRunner(rightRunner);
    setRightRunner(temp);
  };

  const hasSelection = leftRunner || rightRunner;
  const hasBothRunners = leftRunner && rightRunner;

  return (
    <>
      <PageTitle>Compare Runners</PageTitle>
      <div className="flex flex-col h-full px-4 py-4">
        {/* Header with runner selectors */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <GitCompare size="1.25rem" className="text-(--gray-11)" />
            <h2 className="text-sm font-medium text-(--gray-12)">
              Select Runners to Compare
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <RunnerSelector
                label="Runner A"
                selectedRunner={leftRunner}
                onSelect={setLeftRunner}
                searchAtom={leftSearchAtom}
                disabledRunnerId={rightRunner?.id}
              />
            </div>

            <Button
              variant="ghost"
              onClick={handleSwap}
              disabled={!hasBothRunners}
              className="self-center sm:self-end px-2"
              tooltip="Swap runners"
            >
              <ArrowRightLeft size="1rem" />
            </Button>

            <div className="flex-1 w-full sm:w-auto">
              <RunnerSelector
                label="Runner B"
                selectedRunner={rightRunner}
                onSelect={setRightRunner}
                searchAtom={rightSearchAtom}
                disabledRunnerId={leftRunner?.id}
              />
            </div>
          </div>
        </div>

        {/* Comparison content */}
        <div className="flex-1 overflow-auto">
          {!hasSelection ? (
            <NoDataAvailable />
          ) : !hasBothRunners ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="bg-(--gray-3) rounded-full p-4 text-(--gray-11)">
                <GitCompare size="2rem" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-xl font-medium text-(--gray-12)">
                  Select Two Runners
                </h4>
                <p className="text-(--gray-11) max-w-md">
                  Please select both runners to compare their configurations,
                  scripts, and initial files side-by-side.
                </p>
              </div>
            </div>
          ) : (
            <ComparisonView />
          )}
        </div>
      </div>
    </>
  );
}

export default RunnerComparePage;
