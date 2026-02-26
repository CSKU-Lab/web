import CodeEditor from "~/components/Editor/CodeEditor";
import { filesAtom, solutionRunnerAtom } from "../../_stores/editor.store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isOwnerAtom } from "../../_stores/owner.store";
import type { CodeFile } from "~/types/code-material";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { useCallback } from "react";
import type { Runner } from "~/components/Editor/types/runner";
import { cmsRunnerService } from "~/services/cms-runner.service";

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
      const response = await cmsRunnerService.getPagination({
        params: {
          search: query,
          page_size: 20,
        },
        includeScripts: true,
      });
      return response.data;
    },
    [],
  );

  const handleOnChangeSelectedRunner = useCallback(
    (runner: Runner) => {
      setSelectedRunner(runner);
      console.log(runner);
      if (isOwner) {
        setSaveStatus("UnSaved");
        setFiles(
          runner.initial_files.map((file) => ({
            ...file,
            required: true,
          })),
        );
      }
    },
    [setSelectedRunner, setSaveStatus, setFiles, isOwner],
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
      // initialSelectedRunner={selectedRunner}
      onChangeSelectedRunner={handleOnChangeSelectedRunner}
      queryFn={handleSearchRunners}
    />
  );
}

export default EditorSection;
