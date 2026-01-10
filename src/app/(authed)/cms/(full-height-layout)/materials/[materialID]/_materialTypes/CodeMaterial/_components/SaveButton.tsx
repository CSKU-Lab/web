import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { codeAtom, filesAtom, runnerAtom } from "../_stores/editor.store";
import { testCasesAtom } from "../_stores/testcases.store";
import { saveStatusAtom } from "../_stores/save-status.store";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { allowedRunnersAtom, compareScriptAtom } from "../_stores/config.store";
import { queryKeys } from "~/queryKeys";
import { descriptionAtom } from "../_stores/description.store";

interface CodeMaterialLimit {
  cpu_time: number;
  cpu_extra_time: number;
  wall_time: number;
  mempry: number;
  stack: number;
  max_open_files: number;
  max_file_size: number;
  network_allow: boolean;
}

interface CodeMaterialSolutionFile {
  name: string;
  content: string;
}

interface CodeMaterialTestCase {
  order: number;
  input: string;
}

interface CodeMaterialPayload {
  description: string;
  test_cases: CodeMaterialTestCase[];
  allowed_runner_ids: string[];
  compare_script_id: string | null;
  solution_runner_id: string | null;
  solution_files: CodeMaterialSolutionFile[];
  limit: CodeMaterialLimit | null;
}

function SaveButton() {
  const code = useAtomValue(codeAtom);
  const files = useAtomValue(filesAtom);
  const testcases = useAtomValue(testCasesAtom);
  const allowedRunners = useAtomValue(allowedRunnersAtom);
  const compareScript = useAtomValue(compareScriptAtom);
  const description = useAtomValue(descriptionAtom);
  const solutionRunnerID = useAtomValue(runnerAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);

  const { materialID } = useParams<{ materialID: string }>();
  const queryCleint = useQueryClient();
  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      return cmsMaterialService.update(materialID, {
        payload: {
          description: JSON.stringify(description),
          test_cases: testcases.map((tc) => ({
            order: tc.order,
            input: tc.input,
          })),
          allowed_runner_ids: allowedRunners.map((runner) => runner.id) ?? [],
          compare_script_id: compareScript?.id ?? null,
          solution_runner_id: solutionRunnerID,
          solution_files: files,
          limit: null,
        } satisfies CodeMaterialPayload,
      });
    },
    onSuccess: async () => {
      await queryCleint.invalidateQueries({
        queryKey: queryKeys.material.getById(materialID),
      });
      setSaveStatus("Saved");
    },
    onError: () => {
      setSaveStatus("SaveFailed");
    },
  });

  if (saveStatus === "UnSaved") {
    return (
      <button
        onClick={() => save.mutate()}
        className="flex items-center gap-2 px-4 h-fit py-1 text-sm hover:bg-(--gray-3) rounded-md transition-colors"
      >
        <Save size="1rem" />
        Save
      </button>
    );
  }

  return null;
}

export default SaveButton;
