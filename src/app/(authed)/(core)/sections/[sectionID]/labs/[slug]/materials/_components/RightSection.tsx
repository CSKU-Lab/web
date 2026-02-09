"use client";

import { useAtom } from "jotai";
import CodeEditor from "~/components/Editor/CodeEditor";
import {
  submissionFilesAtom,
  selectedRunnerIDAtom,
} from "../[materialID]/_stores/submission.store";
import useGetCoreMaterial from "../[materialID]/_hooks/useGetCoreMaterial";
import type { CoreCodeMaterial } from "~/types/core-code-material";

function RightSection() {
  const [files, setFiles] = useAtom(submissionFilesAtom);
  const [selectedRunnerID, setSelectedRunnerID] = useAtom(selectedRunnerIDAtom);
  const { data: material, isLoading } = useGetCoreMaterial<CoreCodeMaterial>();

  return (
    <div className="flex-1 border-t-0 border-l-0 border flex flex-col min-h-0 min-w-[300px] overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <CodeEditor
          files={files}
          onFilesChange={setFiles}
          permissions={{
            writeFiles: true,
            modifyFiles: false,
            codeExecution: true,
            selectRunner: true,
          }}
          allowedRunners={material?.payload.allowed_runners ?? []}
          initialSelectedRunnerID={selectedRunnerID}
          onChangeSelectedRunnerID={setSelectedRunnerID}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default RightSection;
