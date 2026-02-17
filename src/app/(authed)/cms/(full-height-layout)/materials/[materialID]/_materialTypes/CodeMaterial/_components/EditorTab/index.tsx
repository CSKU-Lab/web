import CodeEditor from "~/components/Editor/CodeEditor";
import { filesAtom, solutionRunnerAtom } from "../../_stores/editor.store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isOwnerAtom } from "../../_stores/owner.store";
import type { CodeFile } from "~/types/code-material";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { useCallback } from "react";
import { configService } from "~/services/config.service";
import type { Runner } from "~/components/Editor/types/runner";

function EditorSection() {
  const [files, setFiles] = useAtom(filesAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const [selectedRunner, setSelectedRunner] = useAtom(solutionRunnerAtom);

  const handleFilesChange = useCallback(
    (newFiles: CodeFile[]) => {
      setFiles(newFiles);
      if (isOwner) {
        setSaveStatus("UnSaved");
      }
    },
    [setFiles, setSaveStatus, isOwner],
  );

  const handleSearchRunners = useCallback(
    async (query: string): Promise<Runner[]> => {
      const response = await configService.getRunners({
        search: query,
        page_size: 20,
      });
      return response.data;
    },
    [],
  );

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
      allowedRunners={[]}
      initialSelectedRunner={selectedRunner}
      onChangeSelectedRunner={setSelectedRunner}
      queryFn={handleSearchRunners}
    />
  );
}

export default EditorSection;
