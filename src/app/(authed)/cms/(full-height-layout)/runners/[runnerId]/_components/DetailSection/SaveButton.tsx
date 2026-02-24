import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryKeys } from "~/queryKeys";
import { cmsRunnerService } from "~/services/cms-runner.service";
import { runnerFilesAtom } from "../../_stores/runner-files.store";
import {
  runnerNameAtom,
  runnerDescriptionAtom,
} from "../../_stores/runner-info.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { editorFilesToRunnerPayload } from "../../_utils/transform-files";
import { Button } from "~/components/commons/Button";

function SaveButton() {
  const { runnerId } = useParams<{ runnerId: string }>();
  const queryClient = useQueryClient();

  const files = useAtomValue(runnerFilesAtom);
  const name = useAtomValue(runnerNameAtom);
  const description = useAtomValue(runnerDescriptionAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);

  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      const { build_script, run_script, initial_files } =
        editorFilesToRunnerPayload(files);

      return cmsRunnerService.updateById(runnerId, {
        name,
        description,
        build_script,
        run_script,
        initial_files,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.runner.getById(runnerId),
      });
      setSaveStatus("Saved");
    },
    onError: (err) => {
      setSaveStatus("SaveFailed");
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to save runner",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
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
