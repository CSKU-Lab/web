import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { codeAtom } from "../_stores/editor.store";
import { testCasesAtom } from "../_stores/testcases.store";
import { saveStatusAtom } from "../_stores/save-status.store";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { allowedRunnersAtom, compareScriptAtom } from "../_stores/config.store";
import { queryKeys } from "~/queryKeys";

function SaveButton() {
  const code = useAtomValue(codeAtom);
  const testcases = useAtomValue(testCasesAtom);
  const allowedRunners = useAtomValue(allowedRunnersAtom);
  const compareScript = useAtomValue(compareScriptAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);

  const { materialID } = useParams<{ materialID: string }>();
  const queryCleint = useQueryClient();
  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      return cmsMaterialService.update(materialID, {
        payload: {
          solution: code,
          test_cases: testcases,
          allowed_runner_ids: allowedRunners.map((runner) => runner.id) ?? [],
          compare_script_id: compareScript?.id ?? null,
        },
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
