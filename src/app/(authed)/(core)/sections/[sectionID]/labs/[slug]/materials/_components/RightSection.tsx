"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import CodeEditor from "~/components/Editor/CodeEditor";
import { configService } from "~/services/config.service";
import {
  submissionFilesAtom,
  selectedRunnerIDAtom,
} from "../[materialID]/_stores/submission.store";

function RightSection() {
  const [files, setFiles] = useAtom(submissionFilesAtom);
  const [selectedRunnerID, setSelectedRunnerID] = useAtom(selectedRunnerIDAtom);
  const queryRunners = useCallback(() => configService.getRunners(), []);

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
          queryRunnerFn={queryRunners}
          initialSelectedRunnerID={selectedRunnerID}
          onChangeSelectedRunnerID={setSelectedRunnerID}
        />
      </div>
    </div>
  );
}

export default RightSection;
