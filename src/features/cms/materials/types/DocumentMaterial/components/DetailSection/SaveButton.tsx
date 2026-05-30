"use client";

import { useAtom, useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { contentAtom } from "~/features/cms/materials/types/DocumentMaterial/stores/content.store";
import { saveStatusAtom } from "~/features/cms/materials/types/DocumentMaterial/stores/save-status.store";
import { isOwnerAtom } from "~/features/cms/materials/types/DocumentMaterial/stores/owner.store";
import type { DocumentMaterialPayload } from "~/features/cms/materials/types/DocumentMaterial/types/document-material-payload";
import { Button } from "~/components/commons/Button";
import useGetMaterial from "~/features/cms/materials/hooks/useGetMaterial";

function SaveButton() {
  const content = useAtomValue(contentAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const { data: material } = useGetMaterial();

  const { courseID, materialID } = useParams<{
    courseID: string;
    materialID: string;
  }>();
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      return cmsMaterialService.update(courseID, materialID, {
        payload: {
          content: JSON.stringify(content),
        } satisfies DocumentMaterialPayload,
        manual_score: material?.manual_score ?? 0,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
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
