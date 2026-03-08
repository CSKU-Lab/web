import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { filesAtom, solutionRunnerAtom } from "../../_stores/editor.store";
import { testCaseGroupsAtom } from "../../_stores/testcase-groups.store";
import {
  compareScriptAtom,
  limitAtom,
} from "../../_stores/config.store";
import { descriptionAtom } from "../../_stores/description.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { isOwnerAtom } from "../../_stores/owner.store";
import { runnerTemplatesAtom } from "../../_components/RunnersTab/_stores/runner-templates.store";
import { resourceFilesAtom } from "../../_stores/resource-files.store";
import type { CodeMaterialPayload } from "../../_types/code-material-payload";
import { Button } from "~/components/commons/Button";

function SaveButton() {
  const testCaseGroups = useAtomValue(testCaseGroupsAtom);
  const compareScript = useAtomValue(compareScriptAtom);
  const description = useAtomValue(descriptionAtom);
  const files = useAtomValue(filesAtom);
  const solutionRunner = useAtomValue(solutionRunnerAtom);
  const limit = useAtomValue(limitAtom);
  const runnerTemplates = useAtomValue(runnerTemplatesAtom);
  const resourceFiles = useAtomValue(resourceFilesAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);

  const { materialID } = useParams<{ materialID: string }>();
  const queryCleint = useQueryClient();
  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      return cmsMaterialService.update(materialID, {
        payload: {
          description: JSON.stringify(description),
          test_case_groups: testCaseGroups,
          allowed_runners: runnerTemplates.map((rt) => ({
            runner_id: rt.id,
            files: rt.initialFiles.map((f) => ({
              name: f.name,
              content: f.content,
            })),
          })),
          compare_script_id: compareScript?.id ?? null,
          solution: solutionRunner
            ? {
                runner_id: solutionRunner.id,
                files: files.map((f) => ({
                  name: f.name,
                  content: f.content,
                })),
              }
            : null,
          resource_files: resourceFiles,
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

  if (!isOwner) {
    return null;
  }

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
