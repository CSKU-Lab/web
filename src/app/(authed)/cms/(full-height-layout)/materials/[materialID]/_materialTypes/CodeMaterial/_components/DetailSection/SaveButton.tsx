import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { solutionAtom } from "../../_stores/solution.store";
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
import useGetMaterial from "../../../../_hooks/useGetMaterial";

function SaveButton() {
  const testCaseGroups = useAtomValue(testCaseGroupsAtom);
  const compareScript = useAtomValue(compareScriptAtom);
  const description = useAtomValue(descriptionAtom);
  const solution = useAtomValue(solutionAtom);
  const limit = useAtomValue(limitAtom);
  const runnerTemplates = useAtomValue(runnerTemplatesAtom);
  const resourceFiles = useAtomValue(resourceFilesAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const { data: material } = useGetMaterial();

  const { courseID, materialID } = useParams<{
    courseID: string;
    materialID: string;
  }>();
  const queryCleint = useQueryClient();
  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      return cmsMaterialService.update(courseID, materialID, {
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
          solution: solution
            ? {
                runner_id: solution.runner.id,
                files: solution.files.map((f) => ({
                  name: f.name,
                  content: f.content,
                })),
              }
            : null,
          resource_files: resourceFiles,
          limit,
        } satisfies CodeMaterialPayload,
        manual_score: material?.manual_score ?? 0,
      });
    },
    onSuccess: async () => {
      await queryCleint.invalidateQueries({
        queryKey: queryKeys.material.getById(courseID, materialID),
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
