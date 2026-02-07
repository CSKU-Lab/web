import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { filesAtom, solutionRunnerIDAtom } from "../../_stores/editor.store";
import { testCaseGroupsAtom } from "../../_stores/testcase-groups.store";
import {
  allowedRunnersAtom,
  compareScriptAtom,
  limitAtom,
} from "../../_stores/config.store";
import { descriptionAtom } from "../../_stores/description.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { isOwnerAtom } from "../../_stores/owner.store";
import type { CodeMaterialPayload } from "../../_types/code-material-payload";
import { Button } from "~/components/commons/Button";

function SaveButton() {
  const testCaseGroups = useAtomValue(testCaseGroupsAtom);
  const allowedRunners = useAtomValue(allowedRunnersAtom);
  const compareScript = useAtomValue(compareScriptAtom);
  const description = useAtomValue(descriptionAtom);
  const files = useAtomValue(filesAtom);
  const solutionRunnerID = useAtomValue(solutionRunnerIDAtom);
  const limit = useAtomValue(limitAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);

  if (!isOwner) {
    return null;
  }

  const { materialID } = useParams<{ materialID: string }>();
  const queryCleint = useQueryClient();
  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      return cmsMaterialService.update(materialID, {
        payload: {
          description: JSON.stringify(description),
          test_case_groups: testCaseGroups,
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
      <Button variant="action" onClick={() => save.mutate()}>
        <Save size="1rem" />
        Save Changes
      </Button>
    );
  }

  return null;
}

export default SaveButton;
