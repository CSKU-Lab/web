import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { filesAtom, solutionRunnerIDAtom } from "../_stores/editor.store";
import { testCasesAtom } from "../_stores/testcases.store";
import { saveStatusAtom } from "../_stores/save-status.store";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  allowedRunnersAtom,
  compareScriptAtom,
  limitAtom,
} from "../_stores/config.store";
import { queryKeys } from "~/queryKeys";
import { descriptionAtom } from "../_stores/description.store";
import type { CodeMaterialPayload } from "../_types/code-material-payload";

function SaveButton() {
  const files = useAtomValue(filesAtom);
  const testcases = useAtomValue(testCasesAtom);
  const allowedRunners = useAtomValue(allowedRunnersAtom);
  const compareScript = useAtomValue(compareScriptAtom);
  const description = useAtomValue(descriptionAtom);
  const solutionRunnerID = useAtomValue(solutionRunnerIDAtom);
  const limit = useAtomValue(limitAtom);
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
          limit,
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
