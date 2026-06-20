import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { solutionAtom } from "~/features/cms/materials/types/CodeMaterial/stores/solution.store";
import { testCaseGroupsAtom } from "~/features/cms/materials/types/CodeMaterial/stores/testcase-groups.store";
import {
  compareScriptAtom,
  limitAtom,
} from "~/features/cms/materials/types/CodeMaterial/stores/config.store";
import { descriptionAtom } from "~/features/cms/materials/types/CodeMaterial/stores/description.store";
import { saveStatusAtom } from "~/features/cms/materials/types/CodeMaterial/stores/save-status.store";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";
import { runnerTemplatesAtom } from "~/features/cms/materials/types/CodeMaterial/components/RunnersTab/stores/runner-templates.store";
import { resourceFilesAtom } from "~/features/cms/materials/types/CodeMaterial/stores/resource-files.store";
import type { CodeMaterialPayload } from "~/features/cms/materials/types/CodeMaterial/types/code-material-payload";
import { Button } from "~/components/commons/Button";
import useGetMaterial from "~/features/cms/materials/hooks/useGetMaterial";

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
          limits: limit,
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
