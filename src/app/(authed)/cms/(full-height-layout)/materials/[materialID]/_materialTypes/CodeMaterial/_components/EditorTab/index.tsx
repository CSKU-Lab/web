import CodeEditor from "~/components/Editor/CodeEditor";
import { filesAtom, solutionRunnerIDAtom } from "../../_stores/editor.store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isOwnerAtom } from "../../_stores/owner.store";
import type { CodeFile } from "~/types/code-material";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { configService } from "~/services/config.service";
import { useCallback } from "react";

function EditorSection() {
  const [files, setFiles] = useAtom(filesAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const [selectedRunnerID, setSelectedRunnerID] = useAtom(solutionRunnerIDAtom);

  const handleFilesChange = (newFiles: CodeFile[]) => {
    setFiles(newFiles);
    if (isOwner) {
      setSaveStatus("UnSaved");
    }
  };

  const queryRunners = useCallback(() => configService.getRunners(), []);

  return (
    <CodeEditor
      files={files}
      onFilesChange={handleFilesChange}
      permissions={{
        writeFiles: isOwner,
        modifyFiles: isOwner,
        codeExecution: isOwner,
        selectRunner: isOwner,
      }}
      queryRunnerFn={queryRunners}
      initialSelectedRunnerID={selectedRunnerID}
      onChangeSelectedRunnerID={setSelectedRunnerID}
    />
  );
}

export default EditorSection;
