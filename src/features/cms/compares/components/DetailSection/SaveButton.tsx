import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryKeys } from "~/queryKeys";
import { cmsCompareService } from "~/services/cms-compare.service";
import { compareFilesAtom } from "../../stores/compare-files.store";
import {
  compareNameAtom,
  compareDescriptionAtom,
  compareRunNameAtom,
} from "../../stores/compare-info.store";
import { saveStatusAtom } from "../../stores/save-status.store";
import { editorFilesToComparePayload } from "../../utils/transform-files";
import { Button } from "~/components/commons/Button";

function SaveButton() {
  const { compareId } = useParams<{ compareId: string }>();
  const queryClient = useQueryClient();

  const files = useAtomValue(compareFilesAtom);
  const name = useAtomValue(compareNameAtom);
  const description = useAtomValue(compareDescriptionAtom);
  const runName = useAtomValue(compareRunNameAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);

  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      const { build_script, run_script, files: compareFiles } =
        editorFilesToComparePayload(files);

      return cmsCompareService.updateById(compareId, {
        name,
        description,
        run_name: runName,
        build_script,
        run_script,
        files: compareFiles,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.compare.getById(compareId),
      });
      setSaveStatus("Saved");
    },
    onError: (err) => {
      setSaveStatus("SaveFailed");
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to save compare",
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
