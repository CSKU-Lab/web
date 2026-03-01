"use client";

import { useAtomValue } from "jotai";
import { runnerTemplatesAtom } from "./_stores/runner-templates.store";
import { isOwnerAtom } from "../../_stores/owner.store";
import RunnerSelector from "./_components/RunnerSelector";
import RunnerTemplateCard from "./_components/RunnerTemplateCard";

function RunnersTab() {
  const runnerTemplates = useAtomValue(runnerTemplatesAtom);
  const isOwner = useAtomValue(isOwnerAtom);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-end mb-4">
        <RunnerSelector disabled={!isOwner} />
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        {runnerTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-(--gray-10)">
            <p className="text-sm">No runners added yet.</p>
            <p className="text-xs mt-1">
              Click &quot;Add Runner&quot; to add a runner template.
            </p>
          </div>
        ) : (
          runnerTemplates.map((runnerTemplate) => (
            <RunnerTemplateCard
              key={runnerTemplate.id}
              runnerTemplate={runnerTemplate}
              disabled={!isOwner}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default RunnersTab;
